<script lang="ts">
  import { Card, CardHeader, CardTitle, CardBody } from "sveltestrap";
  import Loading  from "./Loading.svelte";

  export let title = "";
  export let loading = false;
</script>

<Card class="mb-3">
  {#if title !== ""}
    <CardHeader>
      <CardTitle>{title}</CardTitle>    
    </CardHeader>
  {/if}
  <CardBody>
    {#if loading}
      <Loading />
    {:else}
      <slot />
    {/if}
  </CardBody>
</Card>