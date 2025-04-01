<script lang="ts">
  import type { Snippet } from "svelte";
  import Nav from "./Nav.svelte";
  import Logo from "./Logo.svelte";
  import Footer from "./Footer.svelte";

  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
</script>

<div class="sticky top-4 ml-4 hidden lg:block">
  <Logo />
</div>

<div class="m-auto w-[800px] max-w-full pt-8">
  <div class="mb-4 flex justify-center md:justify-start lg:hidden">
    <Logo />
  </div>

  <div class="mb-8">
    <h1 class="grow text-center text-4xl font-bold md:text-left">
      {title}
    </h1>
  </div>

  <Nav />

  <main class="mx-4 md:mx-0">
    {@render children()}
  </main>

  <Footer />
</div>
