import { Match, Show, Switch } from "solid-js";
import type { Pokemon } from "../../../models/pokemon";
import { customIcons } from "../../../models/pokemon/custom_icon";
import { CustomIcon, CustomIconLoading } from "./custom_icon";
import { SpeciesIcon } from "./species_icon";

export interface PokemonIconProps {
  pokemon: Pokemon;
}

export function PokemonIcon(props: PokemonIconProps) {
  const name = () => props.pokemon.nameWithAltNameOrNoAltName;

  const customIcon = () => customIcons.get(props.pokemon.id);
  const customIconLoading = () => customIcon()?.type === "loading";
  const customIconUrl = () => {
    const icon = customIcon();
    return icon?.type === "custom" ? icon.dataUrl : undefined;
  };

  return (
    <Switch fallback={<SpeciesIcon id={0} name={name()} />}>
      <Match when={customIconUrl()}>{(url) => <CustomIcon name={name()} url={url()} />}</Match>
      <Match when={customIconLoading()}>
        <CustomIconLoading name={name()} />
      </Match>
      <Match when={props.pokemon.species}>
        {(species) => (
          <Show when={props.pokemon.alt} fallback={<SpeciesIcon id={species().id} name={name()} />}>
            {(alt) => <SpeciesIcon id={alt().iconIndex} name={name()} />}
          </Show>
        )}
      </Match>
    </Switch>
  );
}
