import React from 'react';
import PokemonList from './models/PokemonList';
import Pokemon from './models/Pokemon';
import Breakdown from './Breakdown';

const TUTORIAL_MOCK_MONS = PokemonList.from([
  new Pokemon('Ducklett'),
  new Pokemon('Swanna'),
  new Pokemon('Dratini', ['Psychic']),
  new Pokemon('Dragonair', ['Psychic', 'Dragon']),
  new Pokemon('Opaling', ['Fantasy']),
  new Pokemon('Lickitung'),
]) as PokemonList;

type Props = {
  welcome?: boolean;
}

export default function Tutorial({ welcome }: Props) {
  return (
    <div className="Tutorial">
      {welcome && <p>
        Welcome to Stardex! You can use this tool to build balanced Pokédexes by comparing them against the type distributions present in the base Pokémon regions.
      </p>}

      <p>
        In the textbox to the side, you can enter Pokémon names one per line. You can leave blank lines for spacing or comment lines with <code>#</code>.
      </p>

      <p>
        Stardex supports regional forms, custom Pokémon, and custom types. To use any of these, simply specify the types in parentheses after the name, as shown in the example below. You can even add more than two types if your game has a feature like this.
      </p>

      <p>
        If you have Pokémon you think are relatively unimportant to the dex, you can use the <code>@filler</code> modifier. Stardex will recommend these Pokémon for removal when you have too many of a given type.
      </p>

      <textarea readOnly value={`Ducklett\nSwanna\n\n# Regional Forms\nDratini (Psychic)\nDragonair (Psychic/Dragon)\n\n# Totally custom Pokémon and type\nOpaling (Fantasy)\n\n# A Pokémon we don't like and will remove if there are too many normal types\nLickitung @filler`} />

      {welcome && <>
        <p>
          You'll get a type breakdown like this, along with options to compare against existing regions or a combination of them.
        </p>

        <Breakdown mons={TUTORIAL_MOCK_MONS} />

        <p>
          Stardex was created by <a href="https://github.com/tipsypastels">@tipsypastels</a> (Dakota) and <a href="https://github.com/misnina">@misnina</a> (Nina).
        </p>
      </>}
    </div>
  )
}

Tutorial.defaultProps = {
  welcome: true,
}