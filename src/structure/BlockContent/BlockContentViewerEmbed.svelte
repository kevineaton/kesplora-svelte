<script lang="ts">
  import { onMount } from "svelte";
  import { EmbedPDF, EmbedYoutube } from "..";
  import { ProjectsAPI } from "../../api/participant";
  import Loading from "../Loading.svelte";

  export let content: any;
  let loading = true;
  let downloadName = "";

  if (!content.embedType) {
    content.embedType = "external_pdf";
  }
  if (!content.embedLink && !content.fileId) {
    // TODO: show an error
  }
  console.log(content);

  onMount(async () => {
    if(content.embedType === "internal_pdf" && content.fileId === 0){
      
      loading = false; // just move on
    } else {
      // we need to get the file for things like the download link
      try{
        const result = await ProjectsAPI.getFileMeta(content.fileId);
        console.log(result.body.data);
        const f = result.body.data;
        downloadName = `${f.display}${f.fileType}`;
        loading = false;
      }catch(err){

      }
    }
  })

</script>

{#if loading}
  <Loading />
{:else}
  <div class="embed-container">
    {#if content.embedType === "youtube"}
      <EmbedYoutube video={content.embedLink} />
    {:else if content.embedType === "external_pdf"}
      <EmbedPDF pdfURL={content.embedLink} downloadAllowed={true} />
    {:else if content.embedType === "internal_pdf"}
      <EmbedPDF fileId={content.fileId} pdfURL={content.embedLink}  downloadAllowed={true} downloadFilename={downloadName} />
    {/if}
  </div>
{/if}
