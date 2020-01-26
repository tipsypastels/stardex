import Pokemon from "./Pokemon";
import { Type } from "./Type";
import Distributions from "./Distributions";

export default class PokemonList extends Array<Pokemon> {
  static combine(lists: PokemonList[]) {
    const monNames: string[] = [];

    for (let list of lists) {
      for (let mon of list) {
        monNames.push(mon.name);
      }
    }

    return this.fromRegion(monNames);
  }

  static fromRegion(monNames: string[]) {
    return this.from(monNames.map(n => new Pokemon(n)));
  }

  static from(values: Pokemon[]) {
    return super.from(values) as PokemonList;
  }

  get types() {
    return [...new Set(this.unignored.map(mon => mon.typeNames).flat())]
      .map(typeName => new Type(typeName));
  }

  private distributionCache?: Distributions;

  get distributions(): Distributions {
    if (this.distributionCache) {
      return this.distributionCache;
    }

    const result = Distributions.from(this);
    this.distributionCache = result;
    return result;
  }

  withMod(mod: string, andCallback?: (mon: Pokemon) => boolean) {
    return this.filter(mon => {
      return mon.mod(mod)
        && (andCallback ? andCallback(mon) : true)
    });
  }

  private unignoredCache?: PokemonList;

  get unignored() {
    if (this.unignoredCache) {
      return this.unignoredCache;
    }
    
    const value = PokemonList.from(this.filter(mon => !mon.mod('ignore')));
    this.unignoredCache = value;
    return value;
  }
}