<script lang="ts">

  export let content: any = {};
  if(!content.presentationType){
    content.presentationType = "pdf";
  }
  if(!content.embedLink){
    content.embedLink = "";
  }
  
</script>

<div class="block-edit-container">
  <div class="row">
    <div class="col-3">
      <div class="form-group">
        <label for="content.presentationType">Presentation Type</label>
        <select class="form-control" id="content.presentationType" bind:value={content.presentationType}>
          <option value="pdf">PDF, such as Papers or Slides</option>
          <option value="youtube">YouTube Video</option>
        </select>
      </div>
    </div>
    <div class="col-9">
      <div class="form-group">
        <label for="content.embedLink">Embed Link</label>
        <input type="text" class="form-control" id="content.embedLink" bind:value={content.embedLink} />
      </div>
    </div>
  </div>
</div>
