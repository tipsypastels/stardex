import { batch, createSignal } from "solid-js";
import type { PokemonIdDump } from "../../../../models/pokemon/id_dump";
import type { PBSDex } from "../../../../models/pokemon/pbs/dex";
import type { PBSError } from "../../../../models/pokemon/pbs/error";
import type { PBSPokemon } from "../../../../models/pokemon/pbs/pokemon";
import { mergeNamedTextArrays, type NamedText } from "../../../../utils/fs/named_text";
import { readFileListAsNamedTextAsync } from "../../../../utils/fs/web";
import { sortStrings } from "../../../../utils/string";
import type { ImportPBSError } from "./error";

export interface ImportPBSFiles {
  files: NamedText[];
  parsed: ImportPBSParsed;
  errors: ImportPBSError[];
  import(fileList: FileList): Promise<void>;
  importOverwrite(fileList: FileList): Promise<void>;
  removeFilesWithErrors(): Promise<void>;
}

export interface ImportPBSParsed {
  pokemons: Map<string, PBSPokemon>;
  formsCount: number;
  dexes: Map<number, PBSDex>;
}

export function createImportPBSFiles(makeIdDump?: () => PokemonIdDump | undefined): ImportPBSFiles {
  const [files, setFiles] = createSignal<NamedText[]>([]);
  const [parsed, setParsed] = createSignal<ImportPBSParsed>({
    pokemons: new Map(),
    formsCount: 0,
    dexes: new Map(),
  });
  const [errors, setErrors] = createSignal<ImportPBSError[]>([]);

  async function importImpl(fileList: FileList, overwrite = false) {
    const oldFiles = overwrite ? [] : files();
    const newFiles = await readFileListAsNamedTextAsync(fileList);
    const allFiles = mergeNamedTextArrays(oldFiles, newFiles);
    const result = await parse(allFiles, makeIdDump);

    batch(() => {
      setFiles(allFiles);
      setParsed(result.parsed);
      setErrors(result.errors);
    });
  }

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
      await importImpl(fileList, false);
    },

    async importOverwrite(fileList) {
      await importImpl(fileList, true);
    },

    async removeFilesWithErrors() {
      const filesWithErrors = new Set<string>();
      for (const error of errors()) {
        if (error.type === "model") {
          filesWithErrors.add(error.error.fileName);
        }
      }
      const files = this.files.filter((file) => !filesWithErrors.has(file.name));
      const result = await parse(files, makeIdDump);

      batch(() => {
        setFiles(files);
        setParsed(result.parsed);
        setErrors(result.errors);
      });
    },
  };
}

async function parse(files: NamedText[], makeIdDump?: () => PokemonIdDump | undefined) {
  const parsed: ImportPBSParsed = {
    pokemons: new Map(),
    formsCount: 0,
    dexes: new Map(),
  };
  const errors: ImportPBSError[] = [];
  const idDump = makeIdDump?.();

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
    const result = parsePBSAsPokemons(file, parsed.pokemons, idDump);

    errors.push(...errorsFromModelErrors(result.errors));
  }

  for (const file of formFiles) {
    const { parsePBSAsForms } = await import("../../../../models/pokemon/pbs/form");
    const result = parsePBSAsForms(file, parsed.pokemons, idDump);

    errors.push(...errorsFromModelErrors(result.errors));
    parsed.formsCount += result.count;
  }

  for (const file of dexFiles) {
    const { parsePBSAsDexes } = await import("../../../../models/pokemon/pbs/dex");
    const result = parsePBSAsDexes(file, parsed.dexes);

    errors.push(...errorsFromModelErrors(result.errors));
  }

  if (parsed.pokemons.size === 0) {
    errors.push({
      type: "import",
      message: `Your PBS files have no ${errors.length > 0 ? "valid " : ""}Pokémon.`,
    });
  }

  return { parsed, errors };
}

function errorsFromModelErrors(errors: PBSError[]): ImportPBSError[] {
  return errors.map((error) => ({ type: "model", error }));
}
