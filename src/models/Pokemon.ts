import { Type } from './Type';
import MON_DATA from '../data/MON_DATA';

const LINE_REGEX = /^([\w-']+)(?:\s+(\((?:\w+\/)*\w+\)))?(?:\s+\[(.+)\])?(?:\s+(?:(@\w+)\s+)*(@\w+))?$/;

type PokemonOpts = Partial<{
  mods: string[];
  habitat: string | undefined;
}>;

export default class Pokemon {
  static fromLine(line: string): Pokemon | undefined {
    line = line.trim();

    if (!line || line.startsWith('#')) {
      return;
    }

    let match = LINE_REGEX.exec(line);
    if (!match) {
      throw new Error(`${line} is not a valid dex entry.`);
    }
    const [, name, ...values] = match;
    const mods: string[] = [];
    let types: string[] = [];
    let habitat = undefined;

    for (let value of values) {
      if (!value) {
        continue;
      }

      if (value.startsWith('@')) {
        mods.push(value);
      } else if (value.startsWith('(')) {
        types = value.slice(1, -1).split('/');
      } else {
        habitat = value;
      }
    }

    return new Pokemon(name, types, { mods, habitat });
  }

  name: string;
  types: Type[];
  mods: string[];
  habitat: string | undefined;

  constructor(name: string, typeNames: string[] = [], opts?: PokemonOpts) {
    this.name      = name;
    this.types     = this.createTypes(typeNames);
    this.mods      = opts?.mods || [];
    this.habitat   = opts?.habitat;
  }

  get typeNames() {
    return this.types.map(t => t.name);
  }

  mod(mod: string) {
    if (!mod.startsWith('@')) {
      mod = `@${mod}`;
    }

    return this.mods.includes(mod);
  }

  private createTypes(names: string[]) {
    if (names.length === 0) {
      names = MON_DATA[this.name.toLowerCase()]?.types;

      if (!names) {
        throw new Error(`Could not find builtin Pokémon types for "${this.name}". All custom Pokémon must specify their types.`);
      }
    }

    return names.map(name => new Type(name));
  }
}