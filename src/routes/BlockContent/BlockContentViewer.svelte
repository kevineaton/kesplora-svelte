<script lang="ts">
  import { Card } from "../../structure";
  import { BlockContentViewerExternal, BlockContentViewerPresentation, BlockContentViewerText } from "./";


  export let block;
  
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
        {:else if block.blockType === "presentation"}
          <BlockContentViewerPresentation content={block.content} />
        {:else if block.blockType === "text"}
          <BlockContentViewerText content={block.content} />
        {/if}
      </div>
    </div>
  </Card>
</div>