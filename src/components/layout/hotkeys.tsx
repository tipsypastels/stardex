import { useSignal } from "@preact/signals";
import { For, Show } from "@preact/signals/utils";
import hotkeys, { type KeyHandler } from "hotkeys-js";
import { useEffect } from "preact/hooks";
import { ButtonIcon } from "../common/button_icon";
import { Modal } from "../common/menus/modal";

export function Hotkeys() {
  const open = useSignal(false);

  return (
    <>
      <ButtonIcon icon="keyboard" label="Hotkeys" onClick={() => (open.value = true)} />
      <Show when={open}>
        <HotkeysModal onClose={() => (open.value = false)} />
      </Show>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Infos                                   */
/* -------------------------------------------------------------------------- */

export type HotkeyInfoKey = keyof typeof HOTKEY_INFOS;

const HOTKEY_INFOS = {
  jumpToPokedex: {
    key: "1",
    name: "Jump to Pokédex",
  },
  jumpToTypes: {
    key: "2",
    name: "Jump to Types",
  },
  jumpToRecommendations: {
    key: "3",
    name: "Jump to Recommendations",
  },
  focusAddPokemon: {
    key: "a",
    name: (
      <>
        Focus <em>Add Pokémon</em> Input
      </>
    ),
  },
};

export function useHotkey(key: HotkeyInfoKey, f: KeyHandler) {
  useEffect(() => {
    hotkeys(HOTKEY_INFOS[key].key, f);
    return () => hotkeys.unbind(HOTKEY_INFOS[key].key, f);
  }, []);
}

/* -------------------------------------------------------------------------- */
/*                                    Modal                                   */
/* -------------------------------------------------------------------------- */

interface HotkeysModalProps {
  onClose(): void;
}

function HotkeysModal({ onClose }: HotkeysModalProps) {
  return (
    <Modal title="Hotkeys" onClose={onClose}>
      <ul class="grid grid-cols-2 gap-4">
        <For each={() => Object.entries(HOTKEY_INFOS)} getKey={([key]) => key}>
          {([, { key, name }]) => (
            <li class="rounded-md border-2 border-divider-heavy p-4 text-sm select-none">
              <div class="mb-1 font-bold">{name}</div>
              <div class="keyboard-key">{key}</div>
            </li>
          )}
        </For>
      </ul>
    </Modal>
  );
}
