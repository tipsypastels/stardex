<script lang="ts">
  import { legacyTextFromPokemonList, legacyTextToPokemonList } from "$lib/legacy/text";
  import { pokemon } from "$lib/state/pokemon";
  import CodeMirrorEditor from "svelte-codemirror-editor";

  const RELOAD_DEBOUNCE_MS = 1000;
  let legacyText = $state(legacyTextFromPokemonList($pokemon));
  let timeout: number | undefined;

  $effect(() => {
    legacyText = legacyTextFromPokemonList($pokemon);
  });
</script>

<CodeMirrorEditor
  bind:value={legacyText}
  onchange={() => {
    clearTimeout(timeout);
    setTimeout(() => {
      // TODO: Handle errors.
      pokemon.set(legacyTextToPokemonList(legacyText));
    }, RELOAD_DEBOUNCE_MS);
  }}
/>
