import { Match, Show, Switch } from "solid-js";
import type { Pokemon } from "../../../models/pokemon";
import { customIcons } from "../../../models/pokemon/custom_icon";
import { CustomIcon, CustomIconLoading } from "./custom_icon";
import { SpeciesIcon } from "./species_icon";

export interface PokemonIconProps {
  pokemon: Pokemon;
}

export function PokemonIcon(props: PokemonIconProps) {
  const customIcon = () => customIcons.get(props.pokemon.id);
  const customIconLoading = () => customIcon()?.type === "loading";
  const customIconUrl = () => {
    const icon = customIcon();
    return icon?.type === "custom" ? icon.dataUrl : undefined;
  };

  return (
    <Switch fallback={<SpeciesIcon species={{ id: 0, name: props.pokemon.name }} />}>
      <Match when={customIconUrl()}>
        {(url) => <CustomIcon name={props.pokemon.name} url={url()} />}
      </Match>
      <Match when={customIconLoading()}>
        <CustomIconLoading name={props.pokemon.name} />
      </Match>
      <Match when={props.pokemon.species}>
        {(species) => (
          <Show when={props.pokemon.alt} fallback={<SpeciesIcon species={species()} />}>
            {(alt) => <SpeciesIcon species={{ id: alt().iconIndex, name: species().name }} />}
          </Show>
        )}
      </Match>
    </Switch>
  );
}
