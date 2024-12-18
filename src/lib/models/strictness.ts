const STRICTNESS_MAP = {
  easygoing: {
    name: "Easygoing",
    description: "If you're just trying out Stardex.",
    maximumRatioDifference: 0.1,
  },
  normal: {
    name: "Normal",
    description: "If you're using Stardex as a rough guideline.",
    maximumRatioDifference: 0.04,
  },
  strict: {
    name: "Strict",
    description: "If you're using Stardex as a strict guideline.",
    maximumRatioDifference: 0.02,
  },
  bitchy: {
    name: "Bitchy",
    description: "If you're here for a real fight.",
    maximumRatioDifference: 0.01,
  },
};

export type Strictness = keyof typeof STRICTNESS_MAP;
export const STRICTNESSES = Object.keys(STRICTNESS_MAP) as Strictness[];

export function getStrictnessName(s: Strictness) {
  return STRICTNESS_MAP[s].name;
}

export function getStrictnessDescription(s: Strictness) {
  return STRICTNESS_MAP[s].description;
}

export function getStrictnessMaximumRatioDifference(s: Strictness) {
  return STRICTNESS_MAP[s].maximumRatioDifference;
}
