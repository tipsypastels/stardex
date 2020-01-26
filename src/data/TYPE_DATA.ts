import { IconSource } from "../Icon";

type TypeData = {
  color: string,
  icon: IconSource,
}

const TYPE_DATA: { [key: string]: TypeData } = {
  normal: {
    color: "rgb(168, 168, 120)",
    icon: 'balance-scale',
  },
  fire: {
    color: "rgb(240, 128, 48)",
    icon: 'fire',
  },
  fighting: {
    color: 'rgb(192, 48, 40)',
    icon: 'fist-raised',
  },
  water: {
    color: 'rgb(104, 144, 240)',
    icon: 'water',
  },
  flying: {
    color: 'rgb(168, 144, 240)',
    icon: 'feather-alt',
  },
  grass: {
    color: 'rgb(120, 200, 80)',
    icon: 'leaf',
  },
  poison: {
    color: 'rgb(160, 64, 160)',
    icon: 'flask',
  },
  electric: {
    color: 'rgb(248, 208, 48)',
    icon: 'bolt',
  },
  ground: {
    color: 'rgb(224, 192, 104)',
    icon: 'globe',
  },
  psychic: {
    color: 'rgb(248, 88, 136)',
    icon: 'eye',
  },
  rock: {
    color: 'rgb(184, 160, 56)',
    icon: 'gem',
  },
  ice: {
    color: 'rgb(152, 216, 216)',
    icon: 'icicles',
  },
  bug: {
    color: 'rgb(168, 184, 32)',
    icon: 'bug',
  },
  dragon: {
    color: 'rgb(112, 56, 248)',
    icon: 'dragon',
  },
  ghost: {
    color: 'rgb(112, 88, 152)',
    icon: 'ghost',
  },
  dark: {
    color: 'rgb(112, 88, 72)',
    icon: 'moon',
  },
  steel: {
    color: 'rgb(184, 184, 208)',
    icon: 'robot',
  },
  fairy: {
    color: 'rgb(238, 153, 172)',
    icon: 'sparkles',
  },
}

export default TYPE_DATA;

