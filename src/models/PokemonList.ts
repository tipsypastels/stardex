import Pokemon from "./Pokemon";
import { Type, TypeWithDistribution } from "./Type";

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
    return this.from(monNames.map(n => new Pokemon(n))) as PokemonList;
  }

  get types() {
    return [...new Set(this.map(mon => mon.typeNames).flat())]
      .map(typeName => new Type(typeName));
  }

  get typeDistribution() {
    const distributions = new Map<string, TypeWithDistribution>();

    for (let mon of this) {
      for (let type of mon.types) {
        const current = distributions.get(type.name);
        if (current) {
          distributions.set(type.name, { ...current, count: current.count + 1 })
        } else {
          distributions.set(type.name, { type, count: 1 });
        }
      }
    }

    return distributions;
  }

  withMod(mod: string) {
    return this.filter(mon => mon.mods.includes(mod));
  }
}
