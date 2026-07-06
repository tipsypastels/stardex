<script module lang="ts">
  /**
   * Based on https://github.com/smogon/pokemon-showdown-client/blob/2b45bf167b2fa793845f2a0d659d55f3a347fdeb/play.pokemonshowdown.com/src/battle-dex-data.ts#L151,
   * but filtered to be ONLY actual immutable regional forms, not form(e) changes or cosmetics.
   */
  const REGIONAL_FORM_POSITIONS: { [id: string]: number } = {
    rattataalola: 1032 + 119,
    raticatealola: 1032 + 120,
    raichualola: 1032 + 121,
    sandshrewalola: 1032 + 122,
    sandslashalola: 1032 + 123,
    vulpixalola: 1032 + 124,
    ninetalesalola: 1032 + 125,
    diglettalola: 1032 + 126,
    dugtrioalola: 1032 + 127,
    meowthalola: 1032 + 128,
    persianalola: 1032 + 129,
    geodudealola: 1032 + 130,
    graveleralola: 1032 + 131,
    golemalola: 1032 + 132,
    grimeralola: 1032 + 133,
    mukalola: 1032 + 134,
    exeggutoralola: 1032 + 135,
    marowakalola: 1032 + 136,
    meowthgalar: 1032 + 166,
    ponytagalar: 1032 + 167,
    rapidashgalar: 1032 + 168,
    farfetchdgalar: 1032 + 169,
    weezinggalar: 1032 + 170,
    mrmimegalar: 1032 + 171,
    corsolagalar: 1032 + 172,
    zigzagoongalar: 1032 + 173,
    linoonegalar: 1032 + 174,
    darumakagalar: 1032 + 175,
    darmanitangalar: 1032 + 176,
    darmanitangalarzen: 1032 + 177,
    yamaskgalar: 1032 + 178,
    stunfiskgalar: 1032 + 179,
    slowpokegalar: 1032 + 196,
    slowbrogalar: 1032 + 197,
    articunogalar: 1032 + 200,
    zapdosgalar: 1032 + 201,
    moltresgalar: 1032 + 202,
    slowkinggalar: 1032 + 203,
    growlithehisui: 1032 + 206,
    arcaninehisui: 1032 + 207,
    voltorbhisui: 1032 + 208,
    electrodehisui: 1032 + 209,
    typhlosionhisui: 1032 + 210,
    qwilfishhisui: 1032 + 211,
    sneaselhisui: 1032 + 212,
    samurotthisui: 1032 + 213,
    lilliganthisui: 1032 + 214,
    zoruahisui: 1032 + 215,
    zoroarkhisui: 1032 + 216,
    braviaryhisui: 1032 + 217,
    sliggoohisui: 1032 + 218,
    goodrahisui: 1032 + 219,
    avalugghisui: 1032 + 220,
    decidueyehisui: 1032 + 221,
    taurospaldeacombat: 1032 + 224,
    taurospaldeablaze: 1032 + 225,
    taurospaldeaaqua: 1032 + 226,
    wooperpaldea: 1032 + 227,
  };
</script>

<script lang="ts">
  import { isPokemonCustom, resolvePokemonCurrentAlt, type Pokemon } from "$lib/models/pokemon";
  import SpeciesIcon from "./SpeciesIcon.svelte";

  interface Props {
    for: Pokemon;
  }

  let { for: mon }: Props = $props();
</script>

{#if isPokemonCustom(mon)}
  <SpeciesIcon for={{ id: 0, name: mon.name }} />
{:else}
  <!-- TODO: Clean this up! -->
  {@const alt = resolvePokemonCurrentAlt(mon)}
  {@const regionalFormPositionKey = alt ? `${mon.species.key}${alt.whence}` : undefined}

  {#if regionalFormPositionKey && regionalFormPositionKey in REGIONAL_FORM_POSITIONS}
    <SpeciesIcon
      for={{
        id: REGIONAL_FORM_POSITIONS[regionalFormPositionKey],
        name: mon.species.name,
      }}
    />
  {:else}
    <SpeciesIcon for={mon.species} />
  {/if}
{/if}
