import { Type } from './Type';
import MON_DATA from '../data/MON_DATA';

const LINE_REGEX = /^([\w-']+)(?:\s+(\((?:\w+\/)*\w+\)))?(?:\s+(?:(@\w+)\s+)*(@\w+))?$/;

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

    for (let value of values) {
      if (!value) {
        continue;
      }

      if (value.startsWith('@')) {
        mods.push(value);
      } else {
        types = value.slice(1, -1).split('/');
      }
    }

    return new Pokemon(name, types, mods);
  }

  name: string;
  typeNames: string[];
  mods: string[];

  constructor(name: string, typeNames: string[] = [], mods: string[] = []) {
    this.name      = name;
    this.typeNames = typeNames;
    this.mods      = mods;

    if (typeNames.length === 0 && !MON_DATA[name.toLowerCase()]) {
      throw new Error(`Could not find builtin Pokémon types for "${this.name}". All custom Pokémon must specify their types.`);
    }
  }

  get types(): Type[] {
    let { typeNames } = this;
    
    if (!this.typeNames.length) {
      typeNames = MON_DATA[this.name.toLowerCase()].types;
    }

    return typeNames.map(n => new Type(n));
  }

  mod(mod: string) {
    if (!mod.startsWith('@')) {
      mod = `@${mod}`;
    }

    return this.mods.includes(mod);
  }
}