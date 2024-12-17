export interface Strictness {
  name: string;
  description: string;
  maximumRatioDifference: number;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Strictness {
  export const Easygoing: Strictness = {
    name: "Easygoing",
    description: "If you're just trying out Stardex.",
    maximumRatioDifference: 0.1,
  };

  export const Normal: Strictness = {
    name: "Normal",
    description: "If you're using Stardex as a rough guideline.",
    maximumRatioDifference: 0.04,
  };

  export const Strict: Strictness = {
    name: "Strict",
    description: "If you're using Stardex as a strict guideline.",
    maximumRatioDifference: 0.02,
  };

  export const Bitchy: Strictness = {
    name: "Bitchy",
    description: "If you're here for a real fight.",
    maximumRatioDifference: 0.01,
  };

  export const All = [Easygoing, Normal, Strict, Bitchy];
}
