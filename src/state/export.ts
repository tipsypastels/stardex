import type { PokemonList } from "../models/pokemon/list";
import type { ProjectList } from "../models/project/list";
import { saveToFile } from "../utils/file";
import type { Saver } from "./save";

export function exportJSONFile(saver: Saver) {
  const save = saver.make();
  saveToFile(`Stardex ${save.projectName}.json`, "json", JSON.stringify(save));
}

export function exportTextFile(pokemons: PokemonList, projects: ProjectList) {
  const text = pokemons.peekSerializeToText();
  const name = projects.active.peek().name.peek();
  saveToFile(`Stardex ${name}.txt`, "text", text);
}
