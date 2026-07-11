import { dark } from "../../state/dark";
import { ButtonIcon } from "../common/button_icon";
import { Hotkeys } from "./hotkeys";

export function Controls() {
  return (
    <div class="flex gap-2 text-xl">
      <ButtonIcon
        icon={dark.value ? "sun" : "moon"}
        label={`${dark.value ? "Light" : "Dark"} Mode`}
        onClick={() => (dark.value = !dark.value)}
      />
      <Hotkeys />
    </div>
  );
}
