import React, { useContext, useEffect, useState, useRef, ReactNode } from 'react'
import Pokemon from './models/Pokemon'
import { AppContext } from './App';
import { capitalize } from './helpers/string';
import Icon from './Icon';
import { useLocalStorageState } from './helpers/hooks';

export default function Exporter() {
  const [altPrefix, setAltPrefix] = useLocalStorageState('', 'alt_prefix');
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [{ mons }] = useContext(AppContext);
  const rows: string[][] = [];

  function pushMon(index: number | null, mon: Pokemon) {
    const isAlt = typeof index !== 'number';
    let { name } = mon;

    if (altPrefix && isAlt) {
      name = `${altPrefix} ${name}`;
    }

    rows.push([
      cell(isAlt ? '' : index as number + 1),
      cell(name, { bold: isAlt }),
      ...mon.types.map(type => (
        cell(capitalize(type.name), { color: type.color })
      )),
    ]);
  }

  for (let index = 0; index < mons.length; index++) {
    const mon = mons[index];

    // if (mon.mod('alt')) {
    //   exportables.push({ mon: new Pokemon(mon.name), index });
    //   exportables.push({ mon });
    // } else {
    //   exportables.push({ mon, index });
    // }

    if (mon.mod('alt')) {
      const origForm = new Pokemon(mon.name);

      pushMon(index, origForm);
      pushMon(null, mon);
    } else {
      pushMon(index, mon);
    }
  }

  const colCount = longest(rows);
  const HTMLRows = rows.map(row => `
    <tr style="height: 21px">
      ${row.join('')}
    </tr>
  `).join('');

  const exportableHTML = `
    <table cellspacing="0" cellpadding="0" dir="ltr" border="1" style="table-layout: fixed; font-size: 10pt; font-family: arial,sans,sans-serif; width: 0; border-collapse: collapse; border: none;">
      <colgroup>
        <col width="30">
        <col width="200">
        ${`<col width="100">`.repeat(colCount - 2)}
      </colgroup>

      <tbody>
        ${HTMLRows}
      </tbody>
    </table>
  `

  useEffect(() => {
    setCopied(false);
  }, [exportableHTML, altPrefix]);
  
  return (
    <div className="Exporter">
      <h2>
        Exporter
      </h2>


      <label className="Exporter__alt_prefix">
        Alternate Form Prefix <em>(Optional)</em>
        
        <input
          type="text"
          value={altPrefix}
          onChange={e => setAltPrefix(e.target.value)}
        />
      </label>

      {copied && (
        <div className="copied">
          <Icon src="check-circle" /> Copied to clipboard!
        </div>
      )}

      {!copied && (
        <div>
          Click the table below to copy the data to your clipboard. You can paste it straight into Google Drive and preserve the formatting.
        </div>
      )}

      <div
        className="Exporter__editable"
        ref={ref}
        dangerouslySetInnerHTML={{ __html: exportableHTML }}
        contentEditable
        spellCheck={false}
        onClick={() => {
          ref.current?.focus();
          document.execCommand('selectAll');
          document.execCommand('copy');
          setCopied(true);
          ref.current?.blur();
        }}
        onChange={() => {}}
      />
    </div>
  )
}

type CellOpts = Partial<{
  color: string;
  bold: boolean;
}>;

function cell(content: ReactNode, { color, bold }: CellOpts = {}) {
  return `
    <td style="overflow: hidden; padding: 2px 3px 2px 3px; vertical-align: bottom; ${color ? `background-color: ${color}; color: white;` : ''} ${bold ? 'font-weight: bold;' : ''}">${content}</td>
  `;
}

function longest(list: { length: number }[]): number {
  return list.reduce((a, b) => a.length > b.length ? a : b).length;
}