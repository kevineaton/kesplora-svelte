<script lang="ts">
  import { FileTypeAhead } from "../../../structure";

  export let content: any = {};

  if (!content.embedType) {
    content.embedType = "external_pdf";
  }
  if (!content.embedLink) {
    content.embedLink = "";
  }
  if (!content.fileId) {
    content.fileId = 0;
  }

  const onSelectFile = (selectedFile: any) => {
    content.fileId = selectedFile.id;
    content.embedLink = "";
  };
</script>

<div class="block-edit-container">
  <div class="row">
    <div class="col-5">
      <div class="form-group">
        <label for="content.embedType">Presentation Type</label>
        <select
          class="form-control"
          id="content.embedType"
          bind:value={content.embedType}
        >
          <option value="external_pdf"
            >External PDF Available to Everyone</option
          >
          <option value="internal_pdf"
            >Internal PDF Uploaded in the System</option
          >
          <option value="youtube">YouTube Video</option>
        </select>
      </div>
    </div>
    {#if content.embedType === "internal_pdf"}
      <div class="col-7">
        <div class="form-group">
          <label for="content.embedLink">Select File</label>
          <FileTypeAhead files={[]} onSelect={onSelectFile} />
        </div>
      </div>
    {:else}
      <div class="col-7">
        <div class="form-group">
          <label for="content.embedLink">Embed Link</label>
          <input
            type="text"
            class="form-control"
            id="content.embedLink"
            bind:value={content.embedLink}
          />
        </div>
      </div>
    {/if}
  </div>
</div>
