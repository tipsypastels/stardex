import hotkeys from "hotkeys-js";
import type { ComponentChildren } from "preact";
import { useEffect } from "preact/hooks";
import { HotkeyHint } from "../common/hotkey_hint";
import { Icon } from "../common/icon";
import { Link } from "../common/link";
import { ProjectsModal, ProjectsSelect } from "./projects";

export interface LayoutProps {
  children: ComponentChildren;
}

export function Layout(props: LayoutProps) {
  return (
    <>
      <div class="flex min-h-screen flex-col">
        <div class="grow">
          <div class="sticky top-4 ml-4 hidden items-center gap-4 lg:flex">
            <ProjectsSelect />
          </div>

          <div class="m-auto w-200 max-w-full grow pt-8">
            <div class="mb-4 flex flex-col items-center gap-2 lg:mb-12 lg:flex-row lg:gap-3">
              <div
                title="Stardex"
                class="bg-primary shadow-shadow flex h-13.75 w-13.75 items-center justify-center rounded-md text-3xl font-bold text-white shadow-xl select-none"
              >
                <div>Sd</div>
              </div>
              <h1 class="text-primary grow text-4xl font-bold">Stardex</h1>
            </div>

            <div class="mb-4 flex justify-center lg:hidden">
              <ProjectsSelect />
            </div>

            <ProjectsModal />

            {/* TODO: <Notices />
        <Nav /> */}
            <Toc />

            <main class="mx-4 md:mx-0">{props.children}</main>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

function Toc() {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const KEY_POKEDEX = "1";
  const KEY_TYPES = "2";
  const KEY_RECOMMENDATIONS = "3";

  const scrollToPokedex = () => scrollTo("pokedex");
  const scrollToTypes = () => scrollTo("types");
  const scrollToRecommendations = () => scrollTo("recommendations");

  useEffect(() => {
    hotkeys(KEY_POKEDEX, scrollToPokedex);
    hotkeys(KEY_TYPES, scrollToTypes);
    hotkeys(KEY_RECOMMENDATIONS, scrollToRecommendations);

    return () => {
      hotkeys.unbind(KEY_POKEDEX, scrollToPokedex);
      hotkeys.unbind(KEY_TYPES, scrollToTypes);
      hotkeys.unbind(KEY_RECOMMENDATIONS, scrollToRecommendations);
    };
  });

  return (
    <nav class="border-divider-light mb-8 hidden border-y-2 lg:block">
      <ul class="grid grid-cols-[1fr] gap-4 py-2 md:grid-cols-3">
        <li class="text-center">
          <button class="cursor-pointer" onClick={scrollToPokedex}>
            Pokédex
            <HotkeyHint
              hotkey={KEY_POKEDEX}
              title={`Press ${KEY_POKEDEX} to jump to the Pokédex.`}
            />
          </button>
        </li>
        <li class="text-center">
          <button class="cursor-pointer" onClick={scrollToTypes}>
            Types
            <HotkeyHint
              hotkey={KEY_TYPES}
              title={`Press ${KEY_TYPES} to jump to the type chart.`}
            />
          </button>
        </li>
        <li class="text-center">
          <button class="cursor-pointer" onClick={scrollToRecommendations}>
            Recommendations
            <HotkeyHint
              hotkey={KEY_RECOMMENDATIONS}
              title={`Press ${KEY_RECOMMENDATIONS} to jump to the recommendations.`}
            />
          </button>
        </li>
      </ul>
    </nav>
  );
}

function Footer() {
  return (
    <footer class="bg-secondary mt-8 py-8 text-center text-white">
      <div class="mb-1">
        Created by <Icon name="duck" />{" "}
        <Link blank to="https://github.com/tipsypastels" look="none" bold>
          tipsypastels
        </Link>
        .
      </div>
      <div class="text-sm">
        <Link blank to="https://github.com/tipsypastels/stardex/blob/main/CHANGELOG.md" look="none">
          Changelog
        </Link>{" "}
        •{" "}
        <Link blank to="https://github.com/tipsypastels/stardex" look="none">
          GitHub
        </Link>
      </div>
    </footer>
  );
}
