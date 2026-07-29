import { batch, createRoot, createSignal } from "solid-js";
import type { PBSLabelList, PBSParseError, PBSRecord } from "../../../../models/pokemon/pbs/parse";
import { mergeNamedTextArrays, type NamedText } from "../../../../utils/fs/named_text";
import { readFileListAsNamedTextAsync } from "../../../../utils/fs/web";

export interface ImportPBSFilesState {
  files: NamedText[];
  parsed: ImportPBSParsedState;
  errors: PBSParseError[];
  import(fileList: FileList): Promise<void>;
}

export interface ImportPBSParsedState {
  pokemons: PBSRecord[];
  forms: PBSRecord[];
  dexes: PBSLabelList[];
}

export async function createImportPBSFilesState(fileList: FileList): Promise<ImportPBSFilesState> {
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
  const parsed: ImportPBSParsedState = {
    pokemons: [],
    forms: [],
    dexes: [],
  };
  const errors: PBSParseError[] = [];

  for (const file of files) {
    if (/^pokemon_forms(?:_.+)?\.txt$/i.test(file.name)) {
      const { parsePBSAsRecords } = await import("../../../../models/pokemon/pbs/parse");
      const result = parsePBSAsRecords(file);

      parsed.forms.push(...result.records);
      errors.push(...result.errors);
    } else if (/^pokemon(?:_.+)?\.txt$/.test(file.name)) {
      const { parsePBSAsRecords } = await import("../../../../models/pokemon/pbs/parse");
      const result = parsePBSAsRecords(file);

      parsed.pokemons.push(...result.records);
      errors.push(...result.errors);
    } else if (/^regional_dexes(?:_.+)?\.txt$/.test(file.name)) {
      const { parsePBSAsLabelLists } = await import("../../../../models/pokemon/pbs/parse");
      const result = parsePBSAsLabelLists(file);

      parsed.dexes.push(...result.labelLists);
      errors.push(...result.errors);
    }
  }

  return { parsed, errors };
}
