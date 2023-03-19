<script lang="ts">

  export let content: any = {};
  if(!content.externalLink){
    content.externalLink = "";
  }
  
</script>

<div class="block-edit-container">
  <div class="form-group">
    <label for="content.externalLink">External Link</label>
    <input type="text" class="form-control" id="content.externalLink" bind:value={content.externalLink} />
  </div>
</div>
