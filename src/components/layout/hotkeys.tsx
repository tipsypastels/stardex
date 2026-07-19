import hotkeys from "hotkeys-js";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { ButtonIcon } from "../common/button";
import { Modal } from "../common/menus/modal";
import { ProjectsHotkeyButton } from "./projects";

const [open, setOpen] = createSignal(false);

export function Hotkeys() {
  createHotkeys();

  return (
    <>
      <ButtonIcon icon="keyboard" label="Hotkeys" onClick={() => setOpen(true)} />
      <ProjectsHotkeyButton />

      <Show when={open()}>
        <HotkeysModal onClose={() => setOpen(false)} />
      </Show>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Modal                                   */
/* -------------------------------------------------------------------------- */

interface HotkeysModalProps {
  onClose(): void;
}

function HotkeysModal(props: HotkeysModalProps) {
  return (
    <Modal title="Hotkeys" onClose={props.onClose}>
      <ul class="grid grid-cols-2 gap-4">
        <For each={HOTKEYS}>
          {(hotkey) => (
            <li class="rounded-md border-2 border-divider-heavy p-4 text-sm select-none">
              <div class="mb-1 font-bold">{hotkey.name}</div>
              <div class="keyboard-key">{hotkey.key.toUpperCase()}</div>
            </li>
          )}
        </For>
      </ul>
    </Modal>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Hotkeys                                  */
/* -------------------------------------------------------------------------- */

interface Hotkey {
  key: string;
  name: string;
  call(event: KeyboardEvent): void;
}

const HOTKEYS: Hotkey[] = [
  {
    key: "1",
    name: "Jump to Pokédex",
    call() {
      setOpen(false);
      scrollToSection("pokedex");
    },
  },
  {
    key: "2",
    name: "Jump to Types",
    call() {
      setOpen(false);
      scrollToSection("types");
    },
  },
  {
    key: "3",
    name: "Jump to Recommendations",
    call() {
      setOpen(false);
      scrollToSection("recommendations");
    },
  },
  {
    key: "4",
    name: "Jump to Export",
    call() {
      setOpen(false);
      scrollToSection("export");
    },
  },
  {
    key: "a",
    name: "Add Pokémon",
    call(event) {
      event.preventDefault();
      setOpen(false);
      ensureSectionOpen("pokedex");
      document.getElementById("add-pokemon")?.focus();
    },
  },
  {
    key: "m",
    name: "Pokédex Mode",
    call() {
      setOpen(false);
      ensureSectionOpen("pokedex");
      document.getElementById("pokedex-mode")?.click();
    },
  },
  {
    key: "f",
    name: "Filter Pokédex",
    call() {
      setOpen(false);
      ensureSectionOpen("pokedex");
      document.getElementById("pokedex-filter")?.click();
    },
  },
  {
    key: "s",
    name: "Sort Pokédex",
    call() {
      setOpen(false);
      ensureSectionOpen("pokedex");
      document.getElementById("pokedex-sort")?.click();
    },
  },
  {
    key: "z",
    name: "Toggle Zapper",
    call() {
      setOpen(false);
      ensureSectionOpen("pokedex");
      document.getElementById("pokedex-zapper")?.click();
    },
  },
  {
    key: "p",
    name: "Manage Projects",
    call() {
      document.getElementById("manage-projects")?.click();
    },
  },
];

function createHotkeys() {
  onMount(() => {
    for (const hotkey of HOTKEYS) {
      hotkeys(hotkey.key, hotkey.call);
    }
  });

  onCleanup(() => {
    for (const hotkey of HOTKEYS) {
      hotkeys.unbind(hotkey.key, hotkey.call);
    }
  });
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function ensureSectionOpen(id: string) {
  const section = document.getElementById(id);
  if (!section || section.dataset.open === "true") return;

  const button = section.querySelector(
    "[data-section-toggle-container] > button",
  ) as HTMLButtonElement | null;

  button?.click();
}
