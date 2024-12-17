<script lang="ts">
  interface Props {
    name: string;
    class?: string;
  }

  let { name, class: klass }: Props = $props();
</script>

<i class="fas fa-{name} {klass}"></i>
