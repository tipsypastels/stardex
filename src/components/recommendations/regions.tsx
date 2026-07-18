import { For, Show } from "solid-js";
import { REGIONS } from "../../models/region";
import { regions } from "../../models/region/set";
import { TYPES } from "../../models/type";
import { Icon } from "../common/icon";
import { ButtonLink } from "../common/link";
import { Modal } from "../common/menus/modal";
import { TypeName } from "../types/util/name";

export interface RegionsModalProps {
  onClose(): void;
}

export function RegionsModal(props: RegionsModalProps) {
  return (
    <Modal title="Regions" onClose={props.onClose}>
      <div class="mb-4 grid grid-cols-2 gap-4">
        <For each={REGIONS.all}>
          {(region) => (
            <label class="relative flex cursor-pointer rounded-xs border border-divider-light p-2 transition select-none hover:-translate-y-1">
              <input
                class="hidden"
                type="checkbox"
                checked={regions.keys.has(region.key)}
                onClick={(e) => {
                  if (e.currentTarget.checked) {
                    regions.add(region.key);
                  } else {
                    regions.delete(region.key);
                  }
                }}
              />

              <Show when={regions.keys.has(region.key)}>
                <div class="absolute -top-2 -left-2 text-primary">
                  <Icon name="badge-check" />
                </div>
              </Show>

              <div class="mr-2">
                <Icon name={region.icon} />
              </div>

              <div>{region.name}</div>
            </label>
          )}
        </For>
      </div>

      <div class="mb-4">
        <strong>Select: </strong>
        <ButtonLink onClick={() => regions.set(REGIONS.recommendedKeys)}>Recommended</ButtonLink>
        {" / "}
        <ButtonLink onClick={() => regions.set(REGIONS.allKeys)}>All</ButtonLink>
        {" / "}
        <ButtonLink onClick={() => regions.set([])}>None</ButtonLink>
      </div>

      <div class="text-sm">
        <strong>Tip:</strong> Selected regions will be used as the basis of the recommendations
        list. The average distribution of types (for example, what percentage of Pokémon are{" "}
        <TypeName type={TYPES.of("fire")} /> type) will be used to inform recommendations.
      </div>

      <Show when={regions.keys.has("kanto")}>
        <div class="mt-2 text-sm">
          <strong class="text-warning">Warning:</strong> Kanto has a skewed type balance by the
          standards of later regions - for example, too many <TypeName type={TYPES.of("poison")} />{" "}
          types. You may find that you get better results if you{" "}
          <ButtonLink onClick={() => regions.delete("kanto")}>exclude it</ButtonLink>.
        </div>
      </Show>
    </Modal>
  );
}

export function regionsIcon() {
  if (regions.isAll) return "asterisk";
  if (regions.isRecommended) return "check";

  const count = regions.all.length;
  if (count === 0) return "times";
  if (count === 1) return regions.all[0].icon;
  return `${count}`;
}
