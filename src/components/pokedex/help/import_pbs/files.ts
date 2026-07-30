import { batch, createRoot, createSignal } from "solid-js";
import type { PBSDex } from "../../../../models/pokemon/pbs/dex";
import type { PBSError } from "../../../../models/pokemon/pbs/error";
import type { PBSPokemon } from "../../../../models/pokemon/pbs/pokemon";
import { mergeNamedTextArrays, type NamedText } from "../../../../utils/fs/named_text";
import { readFileListAsNamedTextAsync } from "../../../../utils/fs/web";
import { sortStrings } from "../../../../utils/string";

export interface ImportPBSFiles {
  files: NamedText[];
  parsed: ImportPBSParsed;
  errors: PBSError[];
  import(fileList: FileList): Promise<void>;
}

export interface ImportPBSParsed {
  pokemons: Map<string, PBSPokemon>;
  formsCount: number;
  dexes: Map<number, PBSDex>;
}

export async function createImportPBSFiles(fileList: FileList): Promise<ImportPBSFiles> {
  const initialFiles = await readFileListAsNamedTextAsync(fileList);
  const initialResult = await parse(initialFiles);

  return createRoot(() => {
    const [files, setFiles] = createSignal(initialFiles);
    const [parsed, setParsed] = createSignal(initialResult.parsed);
    const [errors, setErrors] = createSignal(initialResult.errors);

    return {
      get files() {
        return files();
      },

      get parsed() {
        return parsed();
      },

      get errors() {
        return errors();
      },

      async import(fileList) {
        const newFiles = await readFileListAsNamedTextAsync(fileList);
        const files = mergeNamedTextArrays(this.files, newFiles);
        const result = await parse(files);

        batch(() => {
          setFiles(files);
          setParsed(result.parsed);
          setErrors(result.errors);
        });
      },
    };
  });
}

async function parse(files: NamedText[]) {
  const parsed: ImportPBSParsed = {
    pokemons: new Map(),
    formsCount: 0,
    dexes: new Map(),
  };
  const errors: PBSError[] = [];

  files.sort((left, right) => sortStrings(left.name, right.name));

  const pokemonFiles: NamedText[] = [];
  const formFiles: NamedText[] = [];
  const dexFiles: NamedText[] = [];

  for (const file of files) {
    if (/^pokemon(?:(?!_forms)_.+)?\.txt$/.test(file.name)) {
      pokemonFiles.push(file);
    } else if (/^pokemon_forms(?:_.+)?\.txt$/i.test(file.name)) {
      formFiles.push(file);
    } else if (/^regional_dexes(?:_.+)?\.txt$/.test(file.name)) {
      dexFiles.push(file);
    }
  }

  for (const file of pokemonFiles) {
    const { parsePBSAsPokemons } = await import("../../../../models/pokemon/pbs/pokemon");
    const { errors } = parsePBSAsPokemons(file, parsed.pokemons);

    errors.push(...errors);
  }

  for (const file of formFiles) {
    const { parsePBSAsForms } = await import("../../../../models/pokemon/pbs/form");
    const { errors, count } = parsePBSAsForms(file, parsed.pokemons);

    errors.push(...errors);
    parsed.formsCount += count;
  }

  for (const file of dexFiles) {
    const { parsePBSAsDexes } = await import("../../../../models/pokemon/pbs/dex");
    const { errors } = parsePBSAsDexes(file, parsed.dexes);

    errors.push(...errors);
  }

  return { parsed, errors };
}
