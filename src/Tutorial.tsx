/** @jsx jsx */
import { jsx } from '@emotion/core';
import { useState, Fragment } from 'react';
import PokemonList from './models/PokemonList';
import Pokemon from './models/Pokemon';
import Breakdown from './shared/Breakdown';
import Modal from './shared/Modal';

const Styles = {
  textarea: {
    display: 'block',
    width: '100%',
    height: '14rem',
    fontSize: '1rem',
    padding: '1rem 0.5rem',
  },
}

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
  const [showMods, setShowMods] = useState(false);

  return (
    <div css={Styles}>
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
        If you have Pokémon you think are relatively unimportant to the dex, you can use the <code>@filler</code> modifier. Stardex will recommend these Pokémon for removal when you have too many of a given type. Correspondingly, you can also use <code>@ignore</code>, which will exclude that Pokémon from counts and recommendations. <span className="link" onClick={() => setShowMods(true)}>Show all modifiers.</span>
      </p>

      <Modal open={showMods} onClose={() => setShowMods(false)}>
        <h1>Modifiers</h1>

        <p>Modifiers change the basic functionality of a Pokédex entry. You can add one or more modifiers at the end of a line.</p>

        <ul css={{ li: { marginBottom: '0.5rem' } }}>
          <li>
            <code>@filler</code> will mark the Pokémon as unimportant and recommend it for removal when there are judged to be too many Pokémon with that type.
          </li>

          <li>
            <code>@ignore</code> will exclude the Pokémon from graphs and recommendations. It will still appear in the exports list.
          </li>

          <li>
            <code>@alt</code> will treat the Pokémon as an alternate form, and add the regular form before it in the exports list automatically (but not to graphs or recommendations).
          </li>
        </ul>
      </Modal>

      <textarea readOnly value={`Ducklett\nSwanna\n\n# Regional Forms\nDratini (Psychic)\nDragonair (Psychic/Dragon)\n\n# Totally custom Pokémon and type\nOpaling (Fantasy)\n\n# A Pokémon we don't like and will remove if there are too many normal types\nLickitung @filler`} />

      {welcome && <Fragment>
        <p>
          You'll get a type breakdown like this, along with options to compare against existing regions or a combination of them.
        </p>

        <Breakdown mons={TUTORIAL_MOCK_MONS} />

        <p>
          Stardex was created by <a href="https://github.com/tipsypastels">@tipsypastels</a> (Dakota) and <a href="https://github.com/misnina">@misnina</a> (Nina) from the <a href="https://github.com/tipsypastels/pokegnosis">Pokémon Gnosis</a> team. Feel free to suggest improvements on the <a href="https://github.com/tipsypastels/stardex">Stardex Github</a>.
        </p>
      </Fragment>}
    </div>
  )
}

Tutorial.defaultProps = {
  welcome: true,
}