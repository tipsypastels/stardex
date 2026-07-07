import { SPECIES, type Species } from "./species";

export const EVOLUTION_LINES = (() => {
  function findOrigin(initial: Species) {
    let origin = initial;
    let originRaw = initial.toRaw();
    while (originRaw.evos?.from) {
      origin = SPECIES.of(originRaw.evos.from);
      originRaw = origin.toRaw();
    }
    return origin;
  }

  function followLine(species: Species, set: Set<Species>) {
    const toKeys = species.toRaw().evos?.to;
    if (toKeys) {
      for (const toKey of toKeys) {
        const to = SPECIES.of(toKey);
        set.add(to);
        followLine(to, set);
      }
    }
  }

  function of(species: Species) {
    const raw = species.toRaw();
    if (!raw.evos || (!raw.evos.from && !raw.evos.to)) {
      return [species];
    }

    const origin = findOrigin(species);
    const set = new Set([species]);

    followLine(origin, set);

    const out = [...set];
    out.sort((a, b) => a.id - b.id);
    return out;
  }

  return { of };
})();
