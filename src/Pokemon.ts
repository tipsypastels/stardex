import randomColor from 'randomcolor';
import TYPE_COLORS from './data/TYPE_COLORS';

export class PokemonList extends Array<Pokemon> {
  get types() {
    return [...new Set(this.map(mon => mon.typeNames).flat())]
      .map(typeName => new Type(typeName));
  }
}

export default class Pokemon {
  name: string;
  typeNames: string[];
  types: Type[];
  mods: string[];

  constructor(name: string, typeNames: string[], mods: string[]) {
    this.name  = name;
    this.typeNames = typeNames;
    this.types = typeNames.map(n => new Type(n));
    this.mods  = mods;
  }
}

export class Type {
  name: string;

  constructor(name: string) {
    this.name = name.toLowerCase();
  }

  get color() {
    return TYPE_COLORS[this.name] 
      || randomColor({ seed: this.name });
  }
}

const LINE_REGEX = /^([\w-]+)(?:\s+\((?:(\w+)\/)*(\w+)\))?(?:\s+(?:(@\w+)\s+)*(@\w+))?$/;

export function createMon(line: string): Pokemon | undefined {
  line = line.trim();

  if (!line) {
    return;
  }

  let match = LINE_REGEX.exec(line);
  if (!match) {
    throw new Error(`${line} is not a valid dex entry.`);
  }

  const [, name, ...values] = match;
  let types = [];
  let mods = [];

  for (let value of values) {
    if (!value) {
      continue;
    }

    if (value.startsWith('@')) {
      mods.push(value);
    } else {
      types.push(value);
    }
  }

  return new Pokemon(name, types, mods);
}