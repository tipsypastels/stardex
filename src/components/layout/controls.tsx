import { dark } from "../../models/ui/dark";
import { ButtonIcon } from "../common/button";
import { Hotkeys } from "./hotkeys";

export function Controls() {
  return (
    <div class="flex gap-2 text-xl">
      <ButtonIcon
        icon={dark.on ? "sun" : "moon"}
        label={`${dark.on ? "Light" : "Dark"} Mode`}
        onClick={() => (dark.on = !dark.on)}
      />
      <Hotkeys />
    </div>
  );
}
