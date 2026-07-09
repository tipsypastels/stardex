import type { ComponentChildren } from "preact";
import { ProjectsModal, ProjectsSelect } from "../projects";
import { Footer } from "./footer";
import { Logo } from "./logo";
import { Toc } from "./toc";

export interface LayoutProps {
  children: ComponentChildren;
}

export function Layout(props: LayoutProps) {
  return (
    <>
      <div class="flex min-h-screen flex-col">
        <div class="grow">
          <div class="sticky mt-4 ml-4 hidden items-center gap-4 lg:flex">
            <ProjectsSelect />
          </div>

          <div class="m-auto w-200 max-w-full grow pt-8">
            <div class="mb-4 flex flex-col items-center gap-2 lg:mb-12 lg:flex-row lg:gap-3">
              <Logo />
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
