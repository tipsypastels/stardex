<script lang="ts">
  interface Props {
    fn(): void;
  }

  let { fn }: Props = $props();
  fn();
</script>
