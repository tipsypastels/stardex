import { Show } from "solid-js";
import { REGIONS } from "../../../models/region";
import { Icon } from "../../common/icon";
import { Modal } from "../../common/menus/modal";
import { PokedexImport } from "../import";
export interface ImportPokedexViaActionProps {
  isOpen: boolean;
  onClose(): void;
  afterImport(): void;
}

export function ImportPokedexViaAction(props: ImportPokedexViaActionProps) {
  return (
    <PokedexImport afterImport={props.afterImport}>
      {(importActions) => (
        <Show when={props.isOpen}>
          <Modal title="Import Pokédex" onClose={() => props.onClose()}>
            <ul>
              <li class="mb-2">
                <label class="flex w-full cursor-pointer items-center gap-2 rounded-md border-2 border-divider-heavy p-2">
                  <input
                    class="hidden"
                    type="file"
                    accept="text/plain,application/json"
                    onChange={(e) => {
                      if (e.currentTarget.files?.length) {
                        props.onClose();
                        importActions.openProject(e.currentTarget.files);
                      }
                    }}
                  />

                  <div class="text-2xl text-secondary">
                    <Icon name="file-chart-pie" />
                  </div>
                  <div>Import a Stardex project.</div>
                </label>
              </li>
              <li class="mb-2">
                <button
                  class="flex w-full cursor-pointer items-center gap-2 rounded-md border-2 border-divider-heavy p-2"
                  onClick={importActions.openPBS}
                >
                  <div class="text-2xl text-secondary">
                    <Icon name="files" />
                  </div>
                  <div>Import Essentials PBS files.</div>
                </button>
              </li>
              <li>
                <button
                  class="flex w-full cursor-pointer items-center gap-2 rounded-md border-2 border-divider-heavy p-2"
                  onClick={importActions.openRegion}
                >
                  <div class="text-2xl text-secondary">
                    <Icon name={REGIONS.of("kanto").icon} />
                  </div>
                  <div>Start from a canon region.</div>
                </button>
              </li>
            </ul>
          </Modal>
        </Show>
      )}
    </PokedexImport>
  );
}
