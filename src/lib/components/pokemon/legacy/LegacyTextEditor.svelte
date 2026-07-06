<script lang="ts">
  import Icon from "$lib/components/common/Icon.svelte";
  import {
    legacyTextFromPokemonDatas,
    LegacyTextParseError,
    legacyTextToPokemonDatas,
  } from "$lib/legacy/text";
  import { pokemons } from "$lib/state/pokemons";
  import CodeMirrorEditor from "svelte-codemirror-editor";
  import { linter } from "@codemirror/lint";

  const RELOAD_DEBOUNCE_MS = 1000;

  let legacyText = $state(legacyTextFromPokemonDatas($pokemons.toJson()));
  let needsHelp = $state(false);
  let errors = $state<LegacyTextParseError[]>([]);
  let errorLinter = $derived.by(() => {
    errors;
    return linter(() => errors);
  });

  let timeout: number | undefined;

  // NOTE: Would be needed if $pokemon could be mutated from other components while this is mounted.
  // $effect(() => {
  //   legacyText = legacyTextFromPokemonList($pokemon);
  // });
</script>

<div>
  <CodeMirrorEditor
    bind:value={legacyText}
    extensions={[errorLinter]}
    onchange={() => {
      clearTimeout(timeout);
      setTimeout(() => {
        const result = legacyTextToPokemonDatas(legacyText);
        pokemons.set(result.pokemon);
        errors = result.errors;
      }, RELOAD_DEBOUNCE_MS);
    }}
  />
</div>

{#if needsHelp}
  <div class="rounded-md border-[1px] border-lime-600 p-4">
    <div class="mb-2 flex text-lime-600">
      <h2 class="grow text-xl font-bold">What to Know - Text Editor Mode</h2>

      <button onclick={() => (needsHelp = false)}>
        <Icon name="times" />
      </button>
    </div>

    <ul class="ml-4 list-disc">
      <li>
        <p>Enter Pokémon names, one per line.</p>
      </li>

      <li>
        <p>Blank lines are ignored, as are lines starting with <code>#</code>.</p>
      </li>

      <li>
        <p>
          To change a Pokemon's type, specify it after the name in parentheses, separated by
          slashes. For example, <code>Bulbasaur (Fire)</code> or
          <code>Monferno (Water/Flying)</code>.
        </p>
      </li>

      <li>
        <p>
          To exclude a Pokémon from recommendations, add <code>@exclude</code> after its name. For
          example, <code>Chansey @exclude</code>.
        </p>
      </li>

      <li>
        <p>You can disable text editor mode at any time from the <strong>Settings</strong> page.</p>
      </li>
    </ul>

    {#if close}
      <div class="mt-4">
        <button class="cursor-pointer text-lime-600 underline" onclick={close}>Got it!</button>
      </div>
    {/if}
  </div>
{:else}
  <div class="text-right">
    <button class="text-sm text-lime-600 underline" onclick={() => (needsHelp = true)}
      >Need help?</button
    >
  </div>
{/if}
