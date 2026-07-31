import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { pokedexMode } from "../../models/pokedex/mode";
import { dark } from "../../models/ui/dark";
import { stored } from "../../utils/storage";
import { ButtonLink } from "../common/link";
import { setHotkeysOpen } from "./hotkeys";

export function Notice() {
  const store = stored("stardex_last_dismissed_notice");
  const initialLastDismissedMs = (() => {
    const value = store.load();
    return typeof value === "number" ? value : 0;
  })();

  const [lastDismissedMs, setLastDismissedMs] = createSignal(initialLastDismissedMs);
  const notice = createMemo(() =>
    NOTICES.find((notice) => notice.date.getTime() > lastDismissedMs()),
  );

  createEffect(() => {
    store.dump(lastDismissedMs());
  });

  return (
    <Show when={notice()}>
      {(notice) => (
        <div class="mx-4 mb-4 rounded-md border-2 border-primary p-4 md:mx-0 lg:mb-8">
          <h2 class="text-xl font-bold">
            <span class="text-primary">What's New?</span>{" "}
            <span class="text-foreground-muted">
              {SHORT_MONTH_NAMES[notice().date.getMonth()]} {notice().date.getDate()}
              {", "}
              {notice().date.getFullYear()}
            </span>
          </h2>

          <div class="my-2">{notice().render()}</div>

          <ButtonLink onClick={() => setLastDismissedMs(notice().date.getTime())}>
            Got it!
          </ButtonLink>
        </div>
      )}
    </Show>
  );
}

const NOTICES = [
  {
    // TODO: Change the date to release.
    date: new Date("Fri Jul 31 2026 06:06:15 GMT-0700 (Pacific Daylight Time)"),
    render() {
      return (
        <>
          <div class="mb-2">
            <h3 class="mb-1 text-lg font-bold">A new (old) Pokédex mode:</h3>
            <ul class="list-inside list-disc">
              <li>
                Added a fully-featured{" "}
                <ButtonLink
                  onClick={() => (pokedexMode.key = "text")}
                  disabled={pokedexMode.key === "text"}
                >
                  text editor mode
                </ButtonLink>{" "}
                inspired by the{" "}
                <span class="transition-colors duration-200 hover:text-[#FB5687]">old Stardex</span>
                .
              </li>
              <li>The text editor can now autocomplete Pokémon, forms, and families.</li>
            </ul>
          </div>

          <div class="mb-2">
            <h3 class="mb-1 text-lg font-bold">New options when editing Pokémon:</h3>
            <ul class="list-inside list-disc">
              <li>
                Support for forms! Non-cosmetic forms are built-in. You can create your own too.
              </li>
              <li>
                Support for custom icons! Use of party icons is recommended. Stardex can crop them
                to one frame or remove backgrounds when uploading.
              </li>
            </ul>
          </div>

          <div class="mb-2">
            <h3 class="mb-1 text-lg font-bold">Have an empty project? More ways to start:</h3>
            <ul class="list-inside list-disc">
              <li>Importing from Essentials PBS files!</li>
              <li>Import all the Pokémon from a canon region.</li>
            </ul>
          </div>

          <div>
            <h3 class="mb-1 text-lg font-bold">Interface improvements:</h3>
            <ul class="list-inside list-disc">
              <li>
                Added <ButtonLink onClick={() => (dark.on = !dark.on)}>dark mode</ButtonLink>!
              </li>
              <li>Drag and drop Pokémon that doesn't suck. Sorry for putting you through that.</li>
              <li>Sort your Pokémon by Pokédex numbers or types.</li>
              <li>Zapper mode to delete Pokémon quickly.</li>
              <li class="max-md:hidden">
                <ButtonLink onClick={() => setHotkeysOpen(true)}>Hotkeys</ButtonLink> for easy
                navigation on desktop.
              </li>
              <li>Restructured the app to put everything on one page.</li>
            </ul>
          </div>
        </>
      );
    },
  },
];

// prettier-ignore
const SHORT_MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
