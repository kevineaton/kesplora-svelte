<script lang="ts">
    import { onMount } from "svelte";
    import { Loading } from "..";
    import { ProjectsAPI } from "../../api/participant";
    import { error } from "../Alert";


  export let content: any;
  export let asAdmin: boolean = false;
  let loading = true;
  let file: any;
  let errorMessage: string = "";
  
  if(!content.fileId){
    content.fileId = "";
  }

  onMount(async () => {
    // we need to get the file meta data so we can properly let the
    // user know about it
    try{
      const result = await ProjectsAPI.getFileMeta(content.fileId, {}, asAdmin);
      file = result.body.data;
      file.fileName = `${file.display}${file.fileType}`;
    }catch(err){
      error("File Unavailable", "We could not fetch that file. Perhaps it was moved?");
      errorMessage = "We could not fetch that file. Perhaps it was moved?";
    }finally{
      loading = false;
    }
  });

  const download = async () => {
    try{
      await ProjectsAPI.downloadFileBinary(content.fileId, file.fileName)
    }catch(err){

    }
  }
</script>

{#if loading}
  <Loading />
{:else if errorMessage !== ""}
  <strong class="text-danger">{errorMessage}</strong>
{:else}
  <button class="btn btn-link" on:click={download}>Download</button>
{/if}