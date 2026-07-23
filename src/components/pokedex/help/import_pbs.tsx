import { batch, createSignal, type JSXElement } from "solid-js";
import { pokemons } from "../../../models/pokemon/list";
import {
  parsePBSFiles,
  PBSAggregateError,
  PBSMissingSectionError,
  PBSMissingTypesError,
} from "../../../models/pokemon/pbs/parse";
import { POKEMON_LIST_VERSION } from "../../../models/pokemon/versioned";
import { toasts } from "../../../models/ui/toast";
import { readFileAsTextAsync } from "../../../utils/file";
import { sortStrings } from "../../../utils/string";
import { Modal } from "../../common/menus/modal";

export function createPBSState() {
  const [error, setError] = createSignal<unknown>();

  return {
    get error() {
      return error();
    },
    async import(files: FileList) {
      const pbsFiles = await Promise.all(
        [...files].map(async (file) => {
          const text = await readFileAsTextAsync(file);
          return { name: file.name, text };
        }),
      );

      pbsFiles.sort((a, b) => sortStrings(a.name, b.name));

      try {
        const pbsPokemons = parsePBSFiles(pbsFiles);

        batch(() => {
          pokemons.setFromRaw({ v: POKEMON_LIST_VERSION, all: pbsPokemons });
          toasts.add("file-arrow-up", `Imported PBS file${files.length === 1 ? "" : "s"}!`);
        });
      } catch (error) {
        setError(error);
      }
    },
    closeError() {
      setError(undefined);
    },
  };
}

export interface ImportPBSErrorModalProps {
  error: unknown;
  onClose(): void;
}

export function ImportPBSErrorModal(props: ImportPBSErrorModalProps) {
  return (
    <Modal title="Invalid PBS File" onClose={props.onClose}>
      <div class="mb-4 rounded-md border-2 border-divider-heavy p-4">{errorToJSX(props.error)}</div>
      <div class="text-center">Stardex can't import this.</div>
    </Modal>
  );
}

function errorToJSX(error: unknown): JSXElement {
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
        - Expected <strong>Types=</strong> for custom Pokémon{" "}
        <strong>[{error.essentialsId}]</strong> at <strong>{error.fileName}</strong> line{" "}
        <strong>{error.lineIndex + 1}</strong>.
      </div>
    );
  } else {
    return `${error}`;
  }
}
