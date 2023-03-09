<script lang="ts">
  import { onMount } from "svelte";
  import PdfViewer from "svelte-pdf";
  import { Loading } from ".";
  import { ProjectsAPI } from "../api/participant";

  export let pdfURL: string = null;
  export let fileId: number = 0;
  export let downloadAllowed: boolean = false;
  export let downloadFilename: string = "";
  let loading = true;
  let data = "";

  // if the fileId is not 0, it's an uploaded file for the system
  // and therefore we need to first fetch it as base64 (since svelte-pdf doesn't send cookies or headers)
  // then encode it; otherwise, it's just passed in

  onMount(async () => {
    if (fileId !== 0 || true) {
      pdfURL = null;
      try {
        const result = await ProjectsAPI.downloadFileBinary(
          fileId,
          "test.pdf", // this should only be needed if the remoteKey is borked
          "base64"
        );
        data = result.body.data;
        loading = false;
      } catch (err) {}
    } else {
      loading = false;
    }
  });

  const download = async () => {
    try{
      await ProjectsAPI.downloadFileBinary(fileId, downloadFilename)
    }catch(err){

    }
  }
</script>

{#if loading}
  <Loading />
{:else}
  <PdfViewer
    url={pdfURL}
    data={atob(data)}
    scale={1.2}
    showButtons={[
      "navigation",
      "zoom",
      "print",
      "rotate",
      "autoflip",
      "pageInfo",
    ]}
  />
  {#if downloadAllowed}
      <div class="row">
        <div class="col-12">
          {#if !fileId || fileId === 0}
            <a href={pdfURL} target="_new">Download</a>
          {:else}
            <button class="btn btn-link" on:click={download}>Download</button>
          {/if}
        </div>
      </div>
  {/if}
{/if}
