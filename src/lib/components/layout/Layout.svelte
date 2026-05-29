<script lang="ts">
  import type { Snippet } from "svelte";
  import Nav from "./Nav.svelte";
  import Notices from "./Notices.svelte";
  import Logo from "./Logo.svelte";
  import Footer from "./Footer.svelte";
  import ProjectsSelect from "../projects/ProjectsSelect.svelte";
  import ProjectsModal from "../projects/ProjectsModal.svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<div class="sticky top-4 ml-4 hidden items-center gap-4 lg:flex">
  <Logo />
  <ProjectsSelect />
</div>

<div class="m-auto w-[800px] max-w-full pt-8">
  <div class="mb-4 flex justify-center md:justify-start lg:hidden">
    <Logo />
  </div>

  <div class="mb-4 flex justify-center lg:hidden">
    <ProjectsSelect />
  </div>

  <div class="mb-8">
    <h1 class="grow text-center text-4xl font-bold md:text-left">
      {title}
    </h1>
  </div>

  <Notices />
  <Nav />

  <main class="mx-4 md:mx-0">
    {@render children()}
  </main>

  <Footer />
</div>

<ProjectsModal />
