<script lang="ts">
  import { FilesAPI } from "../../../api/admin";
  import { error, FileTypeAhead, LoadingButton, success } from "../../../structure";
  export let content: any = {};
  if(!content.fileId){
    content.fileId = 0;
  }

  // TODO: file upload here
  let loadingUpload = false;
  let fileToUpload; // holds files to upload,
  let fileUploadInput; // holds the upload input for clearing

  const onFileSelect = (selected: any) => {
    content.fileId = selected.id;
  }

  const uploadFile = async () => {
    loadingUpload = true;
    try{
      const uploadResult = await FilesAPI.uploadFile(fileToUpload[0]);
      const f = uploadResult.body.data;
      content.fileId = f.id;
      success("Uploaded", "File successfully uploaded.");
    }catch(err){
      error("Upload Error", "Could not upload that binary. Perhaps it is too large for your server?");
    }finally{
      fileToUpload = [];
      fileUploadInput.value = "";
      loadingUpload = false;
    }
  }
</script>

<div class="block-edit-container">
  <div class="row">
    <div class="col-6">
      <div class="form-group">
        <label for="content.externalLink">Existing File</label>
        <FileTypeAhead onSelect={onFileSelect} selectedFileId={content.fileId} />
      </div>
    </div>
    <div class="col-4">
      <div class="form-group">
        <label for="content.externalLink">Upload New File</label>
        <input bind:files={fileToUpload} bind:this={fileUploadInput} id="filesToUpload" name="filesToUpload" type="file" class="form-control" />
      </div>
    </div>
    <div class="col-2">
      {#if fileToUpload && fileToUpload.length > 0}
        <div class="form-group">
          <label for="">Finish Upload</label>
          <LoadingButton onClick={uploadFile} loading={loadingUpload}>Upload</LoadingButton>
        </div>
      {/if}
    </div>
  </div>
</div>
