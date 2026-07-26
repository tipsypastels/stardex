// // import { batch, createSignal, type JSXElement } from "solid-js";
// // import { pokemons } from "../../../models/pokemon/list";
// // import {
// //   parsePBSFiles,
// //   PBSAggregateError,
// //   PBSMissingSectionError,
// //   PBSMissingTypesError,
// // } from "../../../models/pokemon/pbs/parse_old";
// // import { POKEMON_LIST_VERSION } from "../../../models/pokemon/versioned";
// // import { toasts } from "../../../models/ui/toast";
// // import { readFileAsTextAsync } from "../../../utils/file";
// // import { sortStrings } from "../../../utils/string";
// // import { Modal } from "../../common/menus/modal";

// import { createResource, createSignal, For, Show } from "solid-js";
// import type {
//   PBSIndexedLabelList,
//   PBSParseError,
//   PBSRecord,
// } from "../../../models/pokemon/pbs/parse";
// import { readFileAsTextAsync, type NamedText } from "../../../utils/file";
// import { sortStrings } from "../../../utils/string";
// import { Checkbox } from "../../common/forms/checkbox";
// import { LinedSubheading } from "../../common/heading";
// import { Icon } from "../../common/icon";
// import { Modal } from "../../common/menus/modal";

// export interface ImportPBSModalProps {
//   state: ReturnType<typeof createPBSState>;
// }

// export function ImportPBSModal(props: ImportPBSModalProps) {
//   return (
//     <Modal title="Import PBS Files" onClose={() => props.state.clear()}>
//       <Show when={props.state.repr} fallback="Repr Loading">
//         {(repr) => (
//           <Show when={repr().errors.length === 0} fallback="Has Errors">
//             <Inner state={props.state} repr={repr()} />
//           </Show>
//         )}
//       </Show>
//     </Modal>
//   );
// }

// interface InnerProps extends ImportPBSModalProps {
//   repr: ParsedRepr;
// }

// function Inner(props: InnerProps) {
//   function renderRegionFilter() {
//     const intro = (
//       <>
//         <code>pokemon.txt</code> files define <em>every</em> Pokémon that exists in the game, but
//         Stardex is best used with one project per region/Pokédex.
//       </>
//     );

//     const allCheckbox = (
//       <li>
//         <Checkbox
//           name="Include every single Pokémon."
//           radio
//           checked={props.state.regionFilter == null}
//           onChange={() => props.state.setRegionFilter()}
//         />
//       </li>
//     );

//     if (props.repr.dexes.length > 0) {
//       return (
//         <>
//           <p class="mb-2">{intro} Choose a regional dex to include the Pokémon from.</p>
//           <ul>
//             {allCheckbox}

//             <For each={props.repr.dexes}>
//               {(dex) => (
//                 <li>
//                   <Checkbox
//                     name={`Dex ${dex.index} (${dex.labels.slice(0, 3).join(", ")}...)`}
//                     radio
//                     checked={props.state.regionFilter === dex.index}
//                     onChange={() => props.state.setRegionFilter(dex.index)}
//                   />
//                 </li>
//               )}
//             </For>
//           </ul>
//         </>
//       );
//     } else {
//       return (
//         <>
//           <p class="mb-2">
//             {intro} You can upload a <code>regional_dexes.txt</code> and choose a region to only
//             include the Pokémon from.
//           </p>

//           <ul>
//             {allCheckbox}
//             <li>
//               <label class="flex w-fit cursor-pointer items-center select-none">
//                 <input
//                   class="hidden"
//                   type="file"
//                   accept="text/plain"
//                   multiple
//                   onChange={(e) => {
//                     if (e.currentTarget.files?.length) {
//                       props.state.import(e.currentTarget.files);
//                     }
//                   }}
//                 />
//                 <div class="mr-1 text-sm text-checkbox lg:text-base">
//                   <Icon name="circle" />
//                 </div>
//                 <div>Import regional dexes.</div>
//               </label>
//             </li>
//           </ul>
//         </>
//       );
//     }
//   }

//   return (
//     <>
//       <p class="mb-4">
//         Before importing, fill in some details about how your PBS files should be loaded.
//       </p>
//       <div class="text-base">
//         <div>
//           <LinedSubheading>Regional Dex</LinedSubheading>
//           {renderRegionFilter()}
//         </div>
//       </div>
//     </>
//   );
// }

// interface ParsedRepr {
//   errors: PBSParseError[];
//   pokemons: PBSRecord[];
//   dexes: PBSIndexedLabelList[];
//   unknownFileNames: string[];
//   hasForms: boolean;
// }

// export function createPBSState() {
//   // Not using a store because we don't care about changes to individual values, just the list.
//   const [files, setFiles] = createSignal<NamedText[]>([]);

//   const [regionFilter, setRegionFilter] = createSignal<number>();

//   const [repr] = createResource(files, async (files) => {
//     const repr: ParsedRepr = {
//       errors: [],
//       pokemons: [],
//       dexes: [],
//       unknownFileNames: [],
//       hasForms: false,
//     };

//     for (const file of files) {
//       const fileBasename = file.name.replace(/\.txt$/, "");

//       if (fileBasename === "pokemon" || fileBasename.startsWith("pokemon_")) {
//         const { parsePBSAsRecords } = await import("../../../models/pokemon/pbs/parse");
//         const record = parsePBSAsRecords(file);

//         repr.pokemons.push(...record.out);
//         repr.errors.push(...record.errors);
//         repr.hasForms ||= record.anyWithIndices;
//       } else if (fileBasename === "regional_dexes" || fileBasename.startsWith("regional_dexes_")) {
//         const { parsePBSAsIndexedLabelLists } = await import("../../../models/pokemon/pbs/parse");
//         const list = parsePBSAsIndexedLabelLists(file);

//         repr.dexes.push(...list.out);
//         repr.errors.push(...list.errors);
//       } else {
//         repr.unknownFileNames.push(file.name);
//       }
//     }

//     console.log(repr);

//     return repr;
//   });

//   return {
//     get files() {
//       return files();
//     },

//     get repr() {
//       return repr();
//     },

//     get regionFilter() {
//       return regionFilter();
//     },

//     async import(fileList: FileList) {
//       const files = await Promise.all(
//         [...fileList].map(async (file) => {
//           const text = await readFileAsTextAsync(file);
//           return { name: file.name, text };
//         }),
//       );

//       setFiles((oldFiles) => {
//         const filesByName = oldFiles.concat(files).reduce((memo: Record<string, string>, curr) => {
//           return { ...memo, [curr.name]: curr.text };
//         }, {});

//         const allFiles = Object.entries(filesByName).map(([name, text]) => ({ name, text }));
//         allFiles.sort((a, b) => sortStrings(a.name, b.name));
//         return allFiles;
//       });
//     },

//     clear() {
//       setFiles([]);
//     },

//     setRegionFilter,
//   };
// }

// // export function createPBSState() {
// //   const [error, setError] = createSignal<unknown>();

// //   return {
// //     get error() {
// //       return error();
// //     },
// //     async import(files: FileList) {
// //       const pbsFiles = await Promise.all(
// //         [...files].map(async (file) => {
// //           const text = await readFileAsTextAsync(file);
// //           return { name: file.name, text };
// //         }),
// //       );

// //       pbsFiles.sort((a, b) => sortStrings(a.name, b.name));

// //       try {
// //         // TODO: Lazy load this function.
// //         const pbsPokemons = parsePBSFiles(pbsFiles);

// //         batch(() => {
// //           pokemons.setFromRaw({ v: POKEMON_LIST_VERSION, all: pbsPokemons });
// //           toasts.add("file-arrow-up", `Imported PBS file${files.length === 1 ? "" : "s"}!`);
// //         });
// //       } catch (error) {
// //         setError(error);
// //       }
// //     },
// //     closeError() {
// //       setError(undefined);
// //     },
// //   };
// // }

// // export interface ImportPBSErrorModalProps {
// //   error: unknown;
// //   onClose(): void;
// // }

// // export function ImportPBSErrorModal(props: ImportPBSErrorModalProps) {
// //   return (
// //     <Modal title="Invalid PBS File" onClose={props.onClose}>
// //       <div class="mb-4 rounded-md border-2 border-divider-heavy p-4">{errorToJSX(props.error)}</div>
// //       <div class="text-center">Stardex can't import this.</div>
// //     </Modal>
// //   );
// // }

// // function errorToJSX(error: unknown): JSXElement {
// //   if (error instanceof PBSAggregateError) {
// //     return error.errors.map(errorToJSX);
// //   } else if (error instanceof PBSMissingSectionError) {
// //     return (
// //       <div>
// //         - Expected a section, e.g. <strong>[BULBASAUR]</strong> at <strong>{error.fileName}</strong>{" "}
// //         line <strong>{error.lineIndex + 1}</strong>.
// //       </div>
// //     );
// //   } else if (error instanceof PBSMissingTypesError) {
// //     return (
// //       <div>
// //         - Expected <strong>Types=</strong> for custom Pokémon{" "}
// //         <strong>[{error.essentialsId}]</strong> at <strong>{error.fileName}</strong> line{" "}
// //         <strong>{error.lineIndex + 1}</strong>.
// //       </div>
// //     );
// //   } else {
// //     return `${error}`;
// //   }
// // }
