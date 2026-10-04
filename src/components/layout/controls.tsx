import { createSignal, Show } from "solid-js";
import { dark } from "../../models/ui/dark";
import { ButtonIcon } from "../common/button";
import { Dropdown, DropdownItem } from "../common/menus/dropdown";
import { Hotkeys } from "./hotkeys";
import { setInterfaceOpen } from "./interface";

export function Controls() {
  return (
    <div class="flex gap-2 text-xl">
      <ButtonIcon
        icon={dark.on ? "sun" : "moon"}
        label={`${dark.on ? "Light" : "Dark"} Mode`}
        onClick={() => (dark.on = !dark.on)}
      />
      <Hotkeys />
      <ButtonIcon
        icon="table-layout"
        label="Layout"
        onClick={() => setInterfaceOpen((open) => !open)}
      />
    </div>
  );
}

export function MobileControls() {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="absolute top-4 right-4 lg:hidden">
      <div class="text-2xl">
        <ButtonIcon icon="bars" label="Menu" onClick={() => setOpen((open) => !open)} />
      </div>
      <Show when={open()}>
        <Dropdown onClose={() => setOpen(false)}>
          <DropdownItem
            icon={dark.on ? "sun" : "moon"}
            name={`${dark.on ? "Light" : "Dark"} Mode`}
            onClick={() => (dark.on = !dark.on)}
            dontCloseOnClick
          />
          <DropdownItem
            name="Layout"
            icon="table-layout"
            onClick={() => setInterfaceOpen((open) => !open)}
          />
        </Dropdown>
      </Show>
    </div>
  );
}
