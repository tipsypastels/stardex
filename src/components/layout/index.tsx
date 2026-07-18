import type { JSXElement } from "solid-js";
// TODO
// import { ProjectsModal, ProjectsSelect } from "../projects";
// import { Controls } from "./controls";
import { Footer } from "./footer";
// import { MobileJump } from "./jump";
import { Controls } from "./controls";
import { Logo } from "./logo";
import { Toast } from "./toast";

export interface LayoutProps {
  children: JSXElement;
}

export function Layout(props: LayoutProps) {
  return (
    <>
      <div class="flex min-h-screen flex-col">
        <div class="grow">
          <div class="sticky top-4 ml-4 hidden lg:block">
            <div class="mb-2">{/* <ProjectsSelect /> */}</div>
            <div class="ml-2">
              <Controls />
            </div>
          </div>
          <div class="m-auto w-200 max-w-full grow pt-8">
            <div class="mb-4 flex flex-col items-center gap-2 lg:mb-12 lg:flex-row lg:gap-3">
              <Logo />
              <h1 class="grow text-4xl font-bold text-primary">Stardex</h1>
            </div>

            <div class="mb-4 flex justify-center lg:hidden">{/* <ProjectsSelect /> */}</div>

            {/* <ProjectsModal /> */}

            {/* TODO: <Notices /> */}

            {/* <h2 class="border-y border-divider-light py-4 text-2xl font-bold text-foreground-lesser">
              {activeProjectName}
            </h2> */}

            <div class="mb-8 hidden border border-divider-light lg:block" />
            <main class="mx-4 md:mx-0">{props.children}</main>

            <Toast />
            {/* <MobileJump /> */}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
