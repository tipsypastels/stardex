import { batch, useSignal } from "@preact/signals";
import { useContext } from "preact/hooks";
import { parsePBSFile, PBSError } from "../../../models/pokemon/pbs/parse";
import { POKEMON_LIST_VERSION } from "../../../models/versioned";
import { PokemonsContext } from "../../../state/context";
import { toasts } from "../../../state/toast";
import { readonly } from "../../../utils/signal";
import { Modal } from "../../common/menus/modal";

export function usePBSImport() {
  const error = useSignal<unknown>();
  const pokemons = useContext(PokemonsContext);

  return {
    error: readonly(error),
    import(file: File) {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        try {
          const text = fileReader.result as string;
          const pbsPokemons = parsePBSFile(text);

          batch(() => {
            pokemons.setFromRaw({
              v: POKEMON_LIST_VERSION,
              all: pbsPokemons,
            });
            toasts.add("upload", "Imported PBS file!");
          });
        } catch (e) {
          error.value = e;
        }
      };
      fileReader.readAsText(file);
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
      <div class="mb-4 rounded-md border-2 border-divider-heavy p-4">
        {error instanceof PBSError ? (
          <div dangerouslySetInnerHTML={{ __html: error.toHTML() }} />
        ) : (
          <>{`${error}`}</>
        )}
      </div>
      <div class="text-center">Stardex can't import this.</div>
    </Modal>
  );
}
