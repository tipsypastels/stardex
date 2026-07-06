import type { Species } from "./species";

export abstract class Pokemon {
  abstract key: string;
  abstract name: string;
  abstract species: Species | undefined;
  abstract toJSON(): unknown;
}

export class BuiltinPokemon extends Pokemon {
  readonly species: Species;
  #customTypeKeys?: string[];

  constructor(species: Species) {
    super();
    this.species = species;
  }
}

export class CustomPokemon extends Pokemon {
  get species(): undefined {
    return;
  }

  withName(name: string) {}
}
