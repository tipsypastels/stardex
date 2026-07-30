import type { PBSForm } from ".";
import { mapOfArraysAppend } from "../../../../utils/collection";
import { sortStrings } from "../../../../utils/string";
import type { PBSPokemon } from "../pokemon";

export type PBSFormBucket = PBSFormBucketByFormName | PBSFormBucketByLine;

export interface PBSFormBucketByFormName {
  groupedBy: "formName";
  forms: PBSForm[];
  formName: string;
}

export interface PBSFormBucketByLine {
  groupedBy: "line";
  forms: PBSForm[];
  formNames: string[];
  speciesNames: string[];
}

export function getPBSFormBuckets(pokemons: Map<string, PBSPokemon>) {
  const lines = new Lines();
  const formNameToForms = new Map<string, PBSForm[]>();

  for (const pokemon of pokemons.values()) {
    lines.find(pokemon.section);

    if (pokemon.evolvesToSections) {
      for (const toSection of pokemon.evolvesToSections) {
        lines.relate(pokemon.section, toSection);
      }
    }

    for (const form of pokemon.forms) {
      if (!form) continue; // Hole.
      mapOfArraysAppend(formNameToForms, form.formName, form);
    }
  }

  const nameBuckets: PBSFormBucketByFormName[] = [];
  const rootSectionToForms = new Map<string, PBSForm[]>();

  for (const [formName, forms] of formNameToForms) {
    const linesInvolved = new Set(forms.map((form) => lines.find(form.section)));

    if (linesInvolved.size > 1) {
      nameBuckets.push({
        groupedBy: "formName",
        formName,
        forms,
      });
    } else {
      const [rootSection] = linesInvolved;
      mapOfArraysAppend(rootSectionToForms, rootSection, ...forms);
    }
  }

  const lineBuckets = [...rootSectionToForms.values()].map((forms): PBSFormBucketByLine => {
    const formNames = [...new Set(forms.map((form) => form.formName))];
    const speciesNames = [...new Set(forms.map((form) => form.speciesName))];

    return {
      groupedBy: "line",
      forms,
      formNames,
      speciesNames,
    };
  });

  const buckets = [...nameBuckets, ...lineBuckets];
  const asDisplayName = (bucket: PBSFormBucket) =>
    bucket.groupedBy === "formName" ? bucket.formName : bucket.speciesNames[0];

  buckets.sort((left, right) => sortStrings(asDisplayName(left), asDisplayName(right)));
  return buckets;
}

class Lines {
  #roots = new Map<string, string>();

  find(section: string) {
    this.#setAsSelfParentIfNone(section);

    let root = section;

    while (this.#roots.get(root) !== root) {
      root = this.#roots.get(root)!;
    }

    let current = section;

    while (this.#roots.get(current) != root) {
      const next = this.#roots.get(current)!;
      this.#roots.set(current, root);
      current = next;
    }

    return root;
  }

  relate(fromSection: string, toSection: string) {
    const fromRoot = this.find(fromSection);
    const toRoot = this.find(toSection);
    if (fromRoot !== toRoot) {
      this.#roots.set(toRoot, fromRoot);
    }
  }

  #setAsSelfParentIfNone(section: string) {
    if (!this.#roots.has(section)) {
      this.#roots.set(section, section);
    }
  }
}
