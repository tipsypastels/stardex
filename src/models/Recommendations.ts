import { Type } from "./Type";
import PokemonList from "./PokemonList";
import { useContext } from "react";
import { AppContext } from "../App";
import { useSelectedRegionMons } from "../CompareAgainst";

export const STRICTNESSES = {
  easygoing: 10,
  normal: 4,
  strict: 2,
  bitchy: 1,
};
export const STRICTNESS_NAMES = Object.keys(STRICTNESSES) as StrictnessName[];

export type StrictnessName = keyof typeof STRICTNESSES;
export type Strictness = typeof STRICTNESSES[StrictnessName];

type RecommendationsProps = {
  ownMons: PokemonList;
  comparedMons: PokemonList;
  strictness: Strictness;
}

export default class Recommendations extends Array<Recommendation> {
  static generate({ ownMons, comparedMons, strictness }: RecommendationsProps) {
    const ownDists = ownMons.distributions.pad();
    const comparedDists = comparedMons.distributions.pad();
    const recommendations: { [key: string]: Recommendation } = {}

    for (let i = 0; i < comparedDists.list.length; i++) {
      const ownDist = ownDists.list[i];
      const comparedDist = comparedDists.list[i];
      let action: RecommendedAction | undefined = undefined;

      if ((ownDist.percent - comparedDist.percent) > strictness) {
        action = 'remove';
      } else if ((comparedDist.percent - ownDist.percent) > strictness) {
        action = 'add';
      }

      if (action) {
        recommendations[ownDist.type.name] = {
          type: ownDist.type,
          ownPercent: ownDist.percent,
          comparedPercent: comparedDist.percent,
          action,
        };
      }
    }

    return recommendations;
  }
}

export type RecommendedAction = 'add' | 'remove';

export type Recommendation = {
  type: Type;
  ownPercent: number;
  comparedPercent: number;
  action: RecommendedAction;
}

export function useRecommendations() {
  const [{ mons, strictness, regions }] = useContext(AppContext);
  const selectedRegionMons = useSelectedRegionMons();

  if (regions.size === 0) {
    return {};
  }

  return Recommendations.generate({
    ownMons: mons,
    comparedMons: selectedRegionMons,
    strictness,
  });
}