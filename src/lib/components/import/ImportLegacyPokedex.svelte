<script lang="ts">
  import { goto } from "$app/navigation";
  import { PAGE_LINKS } from "$lib/links";
  import { askBeforeOverwritingMons, type Pokemon } from "$lib/models/pokemon";
  import { resolveSpecies } from "$lib/models/species";
  import { pokemon } from "$lib/state/pokemon";
  import { capitalize } from "$lib/utils/strings";

  const LINE_REGEX =
    /^([\w-']+)(?:\s+(\((?:\w+\/)*\w+\)))?(?:\s+\[(.+)\])?(?:\s+(?:(@\w+)\s+)*(@\w+))?$/;

  let text = $state("");

  function apply() {
    const newMons: Pokemon[] = [];

    for (const { key, exclude, type } of parseText()) {
      const species = resolveSpecies(key);

      if (species) {
        newMons.push({ species, exclude, type });
      } else {
        if (!type) {
          return void alert(`Must specify type for ${key}!`);
        }
        newMons.push({
          key,
          name: capitalize(key),
          type,
          exclude,
        });
      }
    }

    if (newMons.length && askBeforeOverwritingMons($pokemon)) {
      pokemon.set(newMons);
      goto(PAGE_LINKS.editor.href);
    }
  }

  function* parseText() {
    const lines = text.split("\n");

    for (let line of lines) {
      line = line.trim();

      if (!line || line.startsWith("#")) {
        continue;
      }

      const match = LINE_REGEX.exec(line);
      if (!match) {
        return void alert(`${line} is not a valid legacy dex entry.`);
      }

      let [, key, ...values] = match;
      key = key.toLowerCase();

      let exclude = false;
      let type: string[] | undefined;

      for (const value of values) {
        if (value === "@ignore") {
          exclude = true;
        } else if (value?.startsWith("(")) {
          type = value.slice(1, -1).toLowerCase().split("/");
        }
      }

      yield { key, exclude, type };
    }
  }
</script>

<textarea
  bind:value={text}
  class="mb-4 block h-[300px] w-full resize-none"
  spellcheck="false"
  placeholder="Paste your Pokémon here..."
></textarea>

<button
  class="rounded-md bg-lime-600 px-4 py-2 font-bold text-white"
  disabled={!text.length}
  onclick={apply}>Load Data</button
>
