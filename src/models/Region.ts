import REGION_DATA from "../data/REGION_DATA";

export const REGION_NAMES = Object.keys(REGION_DATA) as Region[];

type Region = keyof typeof REGION_DATA;
export default Region;

export const DEFAULT_CHECKED_REGIONS = REGION_NAMES.filter(r => r !== 'kanto');