import React, { useContext, useEffect, useState, useRef } from 'react'
import Pokemon from './models/Pokemon'
import { AppContext } from './App';
import { capitalize } from './helpers/string';
import Icon from './Icon';

const CELL_DIVIDER = "	";

export default function Exporter() {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  const [{ mons }] = useContext(AppContext);
  const exportables: Exportable[] = [];

  for (let index = 0; index < mons.length; index++) {
    const mon = mons[index];

    if (mon.mod('alt')) {
      exportables.push({ mon: new Pokemon(mon.name), index });
      exportables.push({ mon });
    } else {
      exportables.push({ mon, index });
    }
  }

  const exportableText = exportables.map(({ index, mon }) => {
    const strings = [mon.name, ...mon.types.map(t => t.name)]
      .map(capitalize);
    
    if (typeof index !== 'undefined') {
      strings.unshift((index + 1).toString());
    } else {
      strings.unshift('');
    }

    return strings.join(CELL_DIVIDER);
  }).join("\n");

  useEffect(() => {
    setCopied(false);
  }, [exportableText]);
  
  return (
    <div className="Exporter">
      <h2>
        Exporter
      </h2>

      <textarea
        ref={ref}
        value={exportableText}
        spellCheck={false}
        onFocus={() => {
          ref.current?.select();
          document.execCommand('copy');
          setCopied(true);
          ref.current?.blur();
        }}
        onChange={() => {}}
      />

      {copied && (
        <div className="copied">
          <Icon src="check-circle" /> Copied to clipboard!
        </div>
      )}
    </div>
  )
}

type Exportable = {
  mon: Pokemon;
  index?: number;
}