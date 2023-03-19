<script type="ts">
  import { onMount } from "svelte";
  import { Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { FilesAPI } from "../../api/admin";
  import { Card, error, LoadingButton, Screen, sizeToReadable, success } from "../../structure";
  import { h } from "gridjs";
  import Grid from "gridjs-svelte";
  import { DateTime } from "luxon";

  let loadingScreen = true;
  let loadingUpload = false;
  let loadingMetaSave = false;
  let allFiles: any[] = [];
  let filteredFiles: any[] = [];
  let search = ""; // fun fact: the svelte grid js implementation search is broken
  let fileToUpload; // holds files to upload,
  let fileUploadInput; // holds the upload input for clearing

  let showSelectedFileModal = false;
  let showDeleteFileModal = false;
  let selectedFile: any = null;

  const columns = [{
    id: "display",
    name: "Display",
  },{
    id: "fileType",
    name: "Type",
  },{
    id: "uploadedOn",
    name: "Uploaded",
  },{
    id: "visibility",
    name: "Visibility",
  },{
    id: "fileSize",
    name: "Size",
  },{
    id: "id",
    name: "",
    formatter: (cell: any) => {
      return [
        h("i", {
          "class": "text-primary bi bi-pencil icon-table",
          "onClick": () => {
            selectFileForUpdating(cell);
          }
        }),
        h("i", {
          "class": "text-primary bi bi-download icon-table",
          "onClick": () => {
            downloadFile(cell);
          }
        }),
        h("i", {
          "class": "text-danger bi bi-trash icon-table",
          "onClick": () => {
            selectFileForDeleting(cell);
          }
        })
      ]
    }
  },];

  onMount(async () => {
    loadingScreen = true;
    try{
      const filesResult = await FilesAPI.getFiles();
      allFiles = processFiles(filesResult.body.data);
      filteredFiles = allFiles;
    }catch(err){
    }finally{
      loadingScreen = false;
    }
  });

  const processFiles = (rawFilesList: any[]) => {
    let output = [];
    for(const f of rawFilesList){
      f.uploadedOn = DateTime.fromISO(f.uploadedOn).toLocaleString(DateTime.DATETIME_FULL);
      f.fileSize = sizeToReadable(f.fileSize);
      output.push(f);
    }
    return output;
  }

  // TODO: we probably want to add a debounce here
  const filterFiles = (rawFilesList: any[]) => {
    let output = [];
    for(const f of rawFilesList){
      if(f.display.includes(search) || f.fileType.includes(search)){
        output.push(f);
      }
    }
    return output;
  }

  const toggleShowSelectedFileModal = () => {
    showSelectedFileModal = !showSelectedFileModal;
  }

  const toggleShowDeleteFileModal = () => {
    showDeleteFileModal = !showDeleteFileModal;
  }

  const selectFileForUpdating = (fileId: number) => {
    for(const f of allFiles){
      if(f.id === fileId){
        selectedFile = f;
        showSelectedFileModal = true;
        break;
      }
    }
  }

  const selectFileForDeleting = (fileId: number) => {
    for(const f of allFiles){
      if(f.id === fileId){
        selectedFile = f;
        showDeleteFileModal = true;
        break;
      }
    }
  }

  const searchTable = (e: any) => {
    search = e.target.value;
    if(search === "") {
      filteredFiles = allFiles;
    } else {
      filteredFiles = filterFiles(allFiles)
    }
  }

  const uploadFile = async () => {
    loadingUpload = true;
    try{
      const uploadResult = await FilesAPI.uploadFile(fileToUpload[0]);
      let processed = processFiles([uploadResult.body.data]);
      allFiles.push(processed[0]);
      allFiles = allFiles;
      filteredFiles = filteredFiles;
      selectedFile = processed[0];
      showSelectedFileModal = true;
      success("Uploaded", "File successfully uploaded. You can now set up some metadata about the file");
    }catch(err){
      error("Upload Error", "Could not upload that binary. Perhaps it is too large for your server?");
    }finally{
      fileToUpload = [];
      fileUploadInput.value = "";
      loadingUpload = false;
    }
  }

  const updateFileMeta = async () => {
    const data = {
      ...selectedFile
    };
    if(data.display === ""){
      return error("Missing Display", "Display is required!");
    }
    loadingMetaSave = true;
    try{
      const result = await FilesAPI.updateFileMeta(selectedFile.id, data);
      const updatedA = processFiles([result.body.data]);
      const updated = updatedA[0];
      let all = [];
      let filtered = [];
      for(const f of allFiles){
        if(f.id === selectedFile.id){
          all.push(updated);
        } else {
          all.push(f);
        }
      }
      for(const f of filteredFiles){
        if(f.id === selectedFile.id){
          filtered.push(updated);
        } else {
          filtered.push(f);
        }
      }
      allFiles = all;
      filteredFiles = filtered;
    }catch(err){
      error("Could Not Save", "We could not save that metadata.");
    }finally{
      showSelectedFileModal = false;
      selectedFile = null;
      loadingMetaSave = false;
    }
  }

  const deleteFile = async () => {
    try {
      await FilesAPI.deleteFile(selectedFile.id);
      let all = [];
      let filtered = [];
      for(const f of allFiles){
        if(f.id !== selectedFile.id){
          all.push(f);
        }
      }
      for(const f of filteredFiles){
        if(f.id !== selectedFile.id){
          filtered.push(f);
        }
      }
      allFiles = all;
      filteredFiles = filtered;
      showDeleteFileModal = false;
    }catch(err){
      error("Delete Error", "Could not delete the file.")
    }
  }

  const downloadFile = async (fileId: number) => {
    try{
      let remoteKey = "file";
      for(const f of allFiles){
        if(f.id === fileId){
          remoteKey = f.remoteKey;
          break;
        }
      }
      await FilesAPI.downloadFileBinary(fileId, remoteKey);
    }catch(err){
      error("Download Error", "We could not download that file.");
    }
  }

</script>

<Screen loading={loadingScreen}>
  <div class="row">
    <div class="col-3">
      <Card title="Upload New File">
        <label for="fileUpload">File Upload</label>
        <input bind:files={fileToUpload} bind:this={fileUploadInput} id="filesToUpload" name="filesToUpload" type="file" class="form-control" />
        {#if fileToUpload && fileToUpload.length > 0}
          <LoadingButton onClick={uploadFile} loading={loadingUpload}>Upload</LoadingButton>
        {/if}
      </Card>
    </div>
    <div class="col-9">
      <div class="row">
        <div class="col-12">
          <Card title="Files">
            <div class="row">
              <div class="col-4">
                <label for="filter">Filter</label>
                <input type="text" class="form-control" value={search} on:keyup={searchTable} />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <Grid data={filteredFiles} columns={columns} sort={true} />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>


  <Modal isOpen={showSelectedFileModal} toggle={toggleShowSelectedFileModal}>
    <ModalHeader toggle={toggleShowSelectedFileModal}>Update {selectedFile.display}</ModalHeader>
    <ModalBody>
      <div class="formGroup">
        <label for="display">Display</label>
        <input type="text" id="display" class="form-control" bind:value={selectedFile.display} />
      </div>
      <div class="formGroup">
        <label for="description">Description</label>
        <textarea class="form-control" id="description" rows={2} bind:value={selectedFile.description} />
      </div>
      <div class="formGroup">
        <label for="visibility">Visibility</label>
        <select id="visibility" class="form-control" bind:value={selectedFile.visibility}>
          <option value="admin">Only Administrators</option>
          <option value="users">All Users</option>
          <option value="project">Only Users in Linked Projects</option>
          <option value="public">Public</option>
        </select>
      </div>
      <div class="formGroup">
        <label for="remoteKey">Key</label>
        <input type="text" id="remoteKey" class="form-control" bind:value={selectedFile.remoteKey} disabled={true} />
      </div>
      <div class="formGroup">
        <label for="fileType">File Type</label>
        <input type="text" id="fileType" class="form-control" bind:value={selectedFile.fileType} disabled={true} />
      </div>
    </ModalBody>
    <ModalFooter>
      <LoadingButton onClick={updateFileMeta} loading={loadingMetaSave}>Save</LoadingButton>
    </ModalFooter>
  </Modal>


  <Modal isOpen={showDeleteFileModal} toggle={toggleShowDeleteFileModal}>
    <ModalHeader toggle={toggleShowDeleteFileModal}>Delete {selectedFile.display}</ModalHeader>
    <ModalBody>
      <strong class="text-danger">Warning:</strong> Are you sure you want to delete the file "{selectedFile.display}"? This cannot be undone!
    </ModalBody>
    <ModalFooter>
      <LoadingButton onClick={deleteFile} loading={loadingMetaSave}>Yes, Delete This File</LoadingButton>
    </ModalFooter>
  </Modal>
</Screen>