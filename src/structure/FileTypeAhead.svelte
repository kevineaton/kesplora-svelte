<script lang="ts">
  import { onMount } from "svelte";
  import Typeahead from "svelte-typeahead";
  import { FilesAPI } from "../api/admin";
  import { error } from "./Alert";
  import Loading from "./Loading.svelte";

  export let files: any[] = [];
  export let selectedFileId: number = 0;
  export let onSelect: any = (selected: any) => {};
  let value: any = "";

  let loading = true;

  const handleSelect = (selected: any) => {
    onSelect(selected.detail.original);
  };

  const extract = (item: any) => {
    return item.displayForFiles;
  };

  onMount(async () => {
    loading = true;
    if (files.length === 0) {
      try {
        const result = await FilesAPI.getFiles({});
        files = result.body.data;
      } catch (err) {
        error("Files Error", "Could not get a list of files");
      }
    }
    for (const f of files) {
      f.displayForFiles = `${f.display} (${f.remoteKey})`;
      if(selectedFileId === f.id){
        value = f.displayForFiles;
      }
    }
    loading = false;
  });
</script>

{#if loading}
  <Loading />
{:else}
  <Typeahead
    class="form-control"
    data={files}
    {extract}
    {value}
    hideLabel
    showDropdownOnFocus={true}
    on:select={handleSelect}
  />
{/if}
