<script lang="ts">
  import "../app.css";
  let { children } = $props();
</script>

<main class="m-auto w-[800px] max-w-full">
  {@render children()}
</main>
