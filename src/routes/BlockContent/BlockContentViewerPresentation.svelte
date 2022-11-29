<script lang="ts">
  import { EmbedPDF, EmbedYoutube } from "../../structure";
  export let content: any;
  if(!content.presentationType){
    content.presentationType = "pdf";
  }
  if(!content.embedLink){
    // TODO: show an error
  }
</script>

<div class="embed-container">
  {#if content.presentationType === "youtube"}
    <EmbedYoutube video={content.embedLink} />
  {:else if content.presentationType === "pdf"}
    <EmbedPDF pdfURL={content.embedLink} />
  {/if}
</div>
