<script lang="ts">
  import { onMount } from "svelte";
  import  Loading  from "./Loading.svelte";

  export let loading: boolean = false;
  export let ignoreAuth: boolean = false;
  export let doNotRefresh: boolean = false;

  // if ignore auth isn't true, we need to check the user
  onMount(async () => {
    if(!ignoreAuth){
      
      // now refresh
      if(!doNotRefresh){

      }
    }
  })
</script>


<div class="section screen">
  {#if loading}
    <Loading />
  {:else}
    <slot />
  {/if}
</div>

<style>

</style>