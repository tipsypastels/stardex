import type { ImportPBSFinishPhase, ImportPBSState } from "./state";

export async function importPBS(_state: ImportPBSState, _phase: ImportPBSFinishPhase) {
  // const mod = await import("../../../../models/pokemon/pbs/extract");
  // const records = phase.files.parsed.pokemons;
  // const sectionSpec =
  //   phase.dexes.section != null ? phase.files.parsed.dexes[phase.dexes.section].labels : undefined;
  // const extractForms = (() => {
  //   switch (phase.forms.granularity) {
  //     case undefined: {
  //       return;
  //     }
  //     case "custom": {
  //       return mod.createPBSFormBucketsExtractor(
  //         must(phase.forms.customBuckets),
  //         phase.forms.customChoices,
  //       );
  //     }
  //     default: {
  //       // TODO
  //     }
  //   }
  // })();
  // const list = mod.extractPBSPokemonRecordsToRawPokemonList({
  //   records,
  //   sectionSpec,
  //   extractForms,
  // });
  // batch(() => {
  //   state.close();
  //   pokemons.setFromRaw(list);
  //   toasts.add("file-arrow-up", `Imported PBS file${phase.files.files.length === 1 ? "" : "s"}!`);
  // });
}
