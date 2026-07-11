import { useSignal } from "@preact/signals";
import { Show } from "@preact/signals/utils";
import { ButtonLink } from "../../common/link";
import { ImportRegionModal } from "./import_region";

export function EmptyPokedex() {
  const modal = useSignal<"import" | "importRegion">();
  return (
    <>
      <div class="rounded-t-md border-2 border-primary p-4">
        <h2 class="mb-2 text-xl font-bold text-primary">What to Know</h2>
        <ul class="ml-4 list-disc">
          <li>Enter a Pokémon's name above to add it to your dex.</li>
          <li>Click on a Pokémon you've added to change its type or settings.</li>
          <li>Drag and drop Pokémon you've added to reorder them.</li>
          <li>You will be given recommendations and statistics based on your Pokédex.</li>
        </ul>
      </div>
      <div class="rounded-b-md border-2 border-t-0 border-primary p-4">
        <h3 class="mb-2 text-lg font-bold text-primary">Other Ways to Start</h3>
        <ul class="ml-4 list-disc">
          <li>
            <ButtonLink onClick={() => (modal.value = "import")}>
              Import a Stardex project.
            </ButtonLink>
          </li>
          <li>
            <ButtonLink onClick={() => (modal.value = "importRegion")}>
              Start from a canon region.
            </ButtonLink>
          </li>
        </ul>
      </div>

      {/* TODO: Implement import. */}

      <Show when={() => modal.value === "importRegion"}>
        <ImportRegionModal onClose={() => (modal.value = undefined)} />
      </Show>
    </>
  );
}
