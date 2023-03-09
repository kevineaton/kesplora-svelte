<script lang="ts">
  import { Card } from ".";
  import { BlockContentViewerExternal, BlockContentViewerFile, BlockContentViewerEmbed, BlockContentViewerText } from "./BlockContent/index";
  
  export let block;
  console.log(block);
</script>

<div class="content-viewer">
  <Card title={block.name}>
    <div class="row">
      <div class="col-12">
        {block.summary}
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        {#if block.blockType === "external"}
          <BlockContentViewerExternal content={block.content} />
        {:else if block.blockType === "embed"}
          <BlockContentViewerEmbed content={block.content} />
        {:else if block.blockType === "file"}
          <BlockContentViewerFile content={block.content} />
        {:else if block.blockType === "text"}
          <BlockContentViewerText content={block.content} />
        {/if}
      </div>
    </div>
  </Card>
</div>