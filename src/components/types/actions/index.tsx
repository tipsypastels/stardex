import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { useContext } from "preact/hooks";
import { ExcludedTypesContext } from "../../../state/context";
import { ActionBar, ActionBarItem } from "../../common/menus/action_bar";
import { ExcludeTypesModal } from "./exclude";

export function TypesActions() {
  const excludeModalOpen = useSignal(false);
  const excludedTypes = useContext(ExcludedTypesContext);

  return (
    <>
      <ActionBar>
        <ActionBarItem
          name="Exclude"
          icon={excludedTypes.all.value.size > 0 ? "eye-closed" : "eye"}
          onClick={() => (excludeModalOpen.value = true)}
        />

        <Show when={excludeModalOpen}>
          <ExcludeTypesModal onClose={() => (excludeModalOpen.value = false)} />
        </Show>
      </ActionBar>
    </>
  );
}
