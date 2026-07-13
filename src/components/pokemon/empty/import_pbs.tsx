import { batch, useSignal } from "@preact/signals";
import type { ComponentChildren } from "preact";
import { useContext } from "preact/hooks";
import {
  parsePBSFiles,
  PBSAggregateError,
  PBSMissingSectionError,
  PBSMissingTypesError,
  type InputPBSFile,
} from "../../../models/pokemon/pbs/parse";
import { POKEMON_LIST_VERSION } from "../../../models/versioned";
import { PokemonsContext } from "../../../state/context";
import { readonly } from "../../../utils/signal";
import { sortStrings } from "../../../utils/string";
import { Modal } from "../../common/menus/modal";

export function usePBSImport() {
  const error = useSignal<unknown>();
  const pokemons = useContext(PokemonsContext);

  return {
    error: readonly(error),
    import(files: FileList) {
      const pbsFiles: InputPBSFile[] = [];

      for (const file of files) {
        const fileReader = new FileReader();

        fileReader.onload = () => {
          const text = fileReader.result as string;
          pbsFiles.push({ name: file.name, text });

          if (pbsFiles.length < files.length) {
            return;
          }

          pbsFiles.sort((a, b) => sortStrings(a.name, b.name));

          try {
            const pbsPokemons = parsePBSFiles(pbsFiles);

            batch(() => {
              pokemons.setFromRaw({
                v: POKEMON_LIST_VERSION,
                all: pbsPokemons,
              });
            });
          } catch (e) {
            error.value = e;
          }
        };
        fileReader.readAsText(file);
      }
    },
    closeError() {
      error.value = undefined;
    },
  };
}

export interface ImportPBSErrorModalProps {
  error: unknown;
  onClose(): void;
}

export function ImportPBSErrorModal({ error, onClose }: ImportPBSErrorModalProps) {
  return (
    <Modal title="Invalid PBS File" onClose={onClose}>
      <div class="mb-4 rounded-md border-2 border-divider-heavy p-4">{errorToJSX(error)}</div>
      <div class="text-center">Stardex can't import this.</div>
    </Modal>
  );
}

function errorToJSX(error: unknown): ComponentChildren {
  if (error instanceof PBSAggregateError) {
    return error.errors.map(errorToJSX);
  } else if (error instanceof PBSMissingSectionError) {
    return (
      <div>
        - Expected a section, e.g. <strong>[BULBASAUR]</strong> at <strong>{error.fileName}</strong>{" "}
        line <strong>{error.lineIndex + 1}</strong>.
      </div>
    );
  } else if (error instanceof PBSMissingTypesError) {
    return (
      <div>
        - Expected <strong>Types=</strong> for custom Pokémon <strong>{error.essentialsId}</strong>{" "}
        at <strong>{error.fileName}</strong> line <strong>{error.lineIndex + 1}</strong>.
      </div>
    );
  } else {
    return `${error}`;
  }
}
