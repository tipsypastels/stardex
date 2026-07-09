import { Show } from "@preact/signals/utils";
import { REGIONS } from "../../models/region";
import type { RegionSet } from "../../models/region_set";
import { TYPES } from "../../models/type";
import { Icon } from "../common/icon";
import { ButtonLink } from "../common/link";
import { Modal } from "../common/menus/modal";
import { TypeName } from "../types/util/name";

export interface RegionsModalProps {
  regions: RegionSet;
  onClose(): void;
}

export function RegionsModal({ regions, onClose }: RegionsModalProps) {
  return (
    <Modal title="Regions" onClose={onClose} large>
      <div class="mb-4 grid grid-cols-2 gap-4">
        {REGIONS.all.map((region) => {
          const checked = regions.has(region);
          return (
            <label class="border-divider-light relative flex cursor-pointer rounded-xs border p-2 transition select-none hover:-translate-y-1">
              <input
                class="hidden"
                type="checkbox"
                checked={checked}
                onClick={(e) => {
                  if (e.currentTarget.checked) {
                    regions.add(region.key);
                  } else {
                    regions.delete(region.key);
                  }
                }}
              />

              {checked ? (
                <div class="text-primary absolute -top-2 -left-2">
                  <Icon name="badge-check" />
                </div>
              ) : null}

              <div class="mr-2">
                <Icon name={region.icon} />
              </div>

              <div>{region.name}</div>
            </label>
          );
        })}
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

      <Show when={() => regions.hasKey("kanto")}>
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

export function regionsIcon(regions: RegionSet) {
  if (regions.isAll.value) return "asterisk";
  if (regions.isRecommended.value) return "check";

  const count = regions.size.value;
  if (count === 0) return "times";
  if (count === 1) return regions.all.value[0].icon;
  return `${count}`;
}
