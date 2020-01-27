/** @jsx jsx */
import { jsx } from '@emotion/core';
import TypeName from './TypeName';
import Pokemon from '../models/Pokemon';

type Props = {
  mons: Pokemon[];
}

export default function PokemonTable({ mons }: Props) {
  return (
    <table>
      <tbody>
        {mons.map(mon => (
          <tr key={mon.name}>
            <td css={{ fontWeight: 'bold' }}>
              {mon.name}

              {mon.mod('ignore') && (
                <span
                  css={{ color: 'var(--primary)' }}
                  title={`${mon.name} is marked with @ignore and does not contribute to the above graph.`}
                >
                  &nbsp;[X]
                      </span>
              )}
            </td>

            {mon.types.map(type => (
              <td key={type.name}>
                <TypeName type={type} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}