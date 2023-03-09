<script lang="ts">
  import { Spinner } from "sveltestrap";
  import Loading from "./Loading.svelte";
  
  export let loading: boolean = false;
  export let classes: string = "btn btn-block btn-primary";
  export let onClick: any = () => {};
</script>

{#if loading}
  <Loading />
{:else}
  <button class={classes} on:click={onClick}><slot /></button>
{/if}