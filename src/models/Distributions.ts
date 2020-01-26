import { Type } from "./Type";
import PokemonList from "./PokemonList";

export default class Distributions {
  static from(mons: PokemonList) {
    let total = 0;
    const counters: { [key: string]: TypeWithCount } = {};

    for (let mon of mons) {
      for (let type of mon.types) {
        const { name } = type;

        total++;

        if (name in counters) {
          counters[name].count++;
        } else {
          counters[name] = { type, count: 1 };
        }
      }
    }

    const list = Object.values(counters)
      .map(dist => ({ ...dist, percent: dist.count / total * 100 }))

    return new this(total, list);
  }

  total: number;
  list: DistributionListing[];
  padded: boolean;
  
  constructor(total: number, list: TypeWithCount[], padded = false) {
    this.total  = total;
    this.list   = list.map(e => new DistributionListing(e, this));
    this.padded = padded;
  }

  pad() {
    if (this.padded) {
      return this;
    }

    const hasTypes: string[] = [];
    let listDup = [...this.list];

    for (const dist of this.list) {
      hasTypes.push(dist.type.name);
    }

    const missingTypes = Type.BUILTINS
      .filter(t => hasTypes.indexOf(t) === -1);

    for (let typeName of missingTypes) {
      listDup.push(new DistributionListing({
        type: new Type(typeName),
        count: 0,
      }, this));
    }

    listDup = listDup.sort((a, b) => {
      return sortPosition(a) - sortPosition(b);
    });

    return new Distributions(this.total, listDup, true);
  }
}

export class DistributionListing {
  type: Type;
  count: number;
  container: Distributions;
  
  constructor({ type, count }: TypeWithCount, container: Distributions) {
    this.type      = type;
    this.count     = count;
    this.container = container;
  }

  get percent() {
    return this.count / this.container.total * 100;
  }
}

type TypeWithCount = {
  type: Type,
  count: number,
}

function sortPosition(dist: DistributionListing) {
  return dist.type.custom
    ? Infinity
    : Type.BUILTINS.indexOf(dist.type.name)
}