import { Show } from "solid-js";
import type { Pokemon } from "../../../models/pokemon";
import { SpeciesIcon } from "./species_icon";

/**
 * Based on https://github.com/smogon/pokemon-showdown-client/blob/2b45bf167b2fa793845f2a0d659d55f3a347fdeb/play.pokemonshowdown.com/src/battle-dex-data.ts#L151,
 * but renamed and filtered to be ONLY actual immutable regional forms, not form(e) changes or cosmetics.
 */
const ALT_POSITIONS: { [id: string]: number } = {
  "rattata-alola": 1032 + 119,
  "raticate-alola": 1032 + 120,
  "raichu-alola": 1032 + 121,
  "sandshrew-alola": 1032 + 122,
  "sandslash-alola": 1032 + 123,
  "vulpix-alola": 1032 + 124,
  "ninetales-alola": 1032 + 125,
  "diglett-alola": 1032 + 126,
  "dugtrio-alola": 1032 + 127,
  "meowth-alola": 1032 + 128,
  "persian-alola": 1032 + 129,
  "geodude-alola": 1032 + 130,
  "graveler-alola": 1032 + 131,
  "golem-alola": 1032 + 132,
  "grimer-alola": 1032 + 133,
  "muk-alola": 1032 + 134,
  "exeggutor-alola": 1032 + 135,
  "marowak-alola": 1032 + 136,
  "meowth-galar": 1032 + 166,
  "ponyta-galar": 1032 + 167,
  "rapidash-galar": 1032 + 168,
  "farfetchd-galar": 1032 + 169,
  "weezing-galar": 1032 + 170,
  "mrmime-galar": 1032 + 171,
  "corsola-galar": 1032 + 172,
  "zigzagoon-galar": 1032 + 173,
  "linoone-galar": 1032 + 174,
  "darumaka-galar": 1032 + 175,
  "darmanitan-galar": 1032 + 176,
  "yamask-galar": 1032 + 178,
  "stunfisk-galar": 1032 + 179,
  "slowpoke-galar": 1032 + 196,
  "slowbro-galar": 1032 + 197,
  "articuno-galar": 1032 + 200,
  "zapdos-galar": 1032 + 201,
  "moltres-galar": 1032 + 202,
  "slowking-galar": 1032 + 203,
  "growlithe-hisui": 1032 + 206,
  "arcanine-hisui": 1032 + 207,
  "voltorb-hisui": 1032 + 208,
  "electrode-hisui": 1032 + 209,
  "typhlosion-hisui": 1032 + 210,
  "qwilfish-hisui": 1032 + 211,
  "sneasel-hisui": 1032 + 212,
  "samurott-hisui": 1032 + 213,
  "lilligant-hisui": 1032 + 214,
  "zorua-hisui": 1032 + 215,
  "zoroark-hisui": 1032 + 216,
  "braviary-hisui": 1032 + 217,
  "sliggoo-hisui": 1032 + 218,
  "goodra-hisui": 1032 + 219,
  "avalugg-hisui": 1032 + 220,
  "decidueye-hisui": 1032 + 221,
  "tauros-paldea-combat-breed": 1032 + 224,
  "tauros-paldea-blaze-breed": 1032 + 225,
  "tauros-paldea-aqua-breed": 1032 + 226,
  "wooper-paldea": 1032 + 227,
};

export interface PokemonIconProps {
  pokemon: Pokemon;
}

export function PokemonIcon(props: PokemonIconProps) {
  // TODO
  // const customIcons = useContext(CustomIconsContext);
  // const customIcon = customIcons.loadedEntries.value.get(pokemon.id.value);
  // if (customIcon) {
  //   return <CustomIcon dataUrl={customIcon.dataUrl} name={pokemon.name.value} />;
  // }

  return (
    <Show
      when={props.pokemon.species}
      fallback={<SpeciesIcon species={{ id: 0, name: props.pokemon.name }} />}
    >
      {(species) => (
        <Show when={props.pokemon.alt} fallback={<SpeciesIcon species={species()} />}>
          {(alt) => (
            <SpeciesIcon
              species={{
                id: ALT_POSITIONS[`${species().key}-${alt().kind}`],
                name: species().name,
              }}
            />
          )}
        </Show>
      )}
    </Show>
  );
}
