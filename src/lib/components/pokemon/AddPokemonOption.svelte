<script lang="ts">
  import type { Species } from "$lib/models/species";
  import type { Snippet } from "svelte";
  import SpeciesIcon from "./SpeciesIcon.svelte";

  interface Props {
    name: string;
    icon: Pick<Species, "id" | "name">;
    "aria-label": string;
    subtitle: Snippet;
    onclick(): void;
  }

  let { name, icon, "aria-label": ariaLabel, subtitle, onclick }: Props = $props();
</script>

<button
  class="flex w-full cursor-pointer items-center rounded-md text-left hover:bg-slate-100"
  aria-label={ariaLabel}
  {onclick}
>
  <div>
    <SpeciesIcon for={icon} />
  </div>

  <div class="grow">
    <div>
      {name}
    </div>

    {@render subtitle()}
  </div>
</button>
