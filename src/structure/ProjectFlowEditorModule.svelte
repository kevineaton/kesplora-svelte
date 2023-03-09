<script lang="ts">
  import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import { BlocksAPI, ModulesAPI } from "../api/admin";
  import BlockContentViewer from "./BlockContentViewer.svelte";
  import Loading from "./Loading.svelte";
  import { error, success } from "./Alert";

  const flipDurationMs = 300;

  export let module: any = {
    id: 0,
    name: "Unknown",
  };
  let blocks = [];
  let selectedBlock: any = null;

  let hasLoadedData = false;
  let loading = false;
  let expanded = false;
  let showPreview = false; // note, we put it in an {#if} as well to prevent a lot of dom elements
  let isDirty = false;
  let warnAboutDrop = true;
  let showWarnAboutDrop = false;

  const toggleList = () => {
    expanded = !expanded;
    if(!hasLoadedData){
      refreshBlockList();
    }
  };

  const togglePreview = () => {
    showPreview = !showPreview;
  }

  const toggleWarn = () => {
    showWarnAboutDrop = !showWarnAboutDrop;
  }

  const selectBlock = (block: any) => {
    selectedBlock = block;
    showPreview = true;
  }

  const refreshBlockList = async () => {
    loading = true;
    try{
      const moduleBlocksResult = await BlocksAPI.getBlocksOnModule(module.id);
      blocks = moduleBlocksResult.body.data;
    }catch(err){}
    finally {
      loading = false;
      hasLoadedData = true;
    }
  }

  const changeModuleStatus = async (e: any) => {
    const status = e.target.value;
    try{
      await ModulesAPI.updateModule(module.id, { status });
      module.status = status;
      success("Updated", `${module.name} is now ${status}`);
    }catch(err){

    }
  }

  //
  // dnd handlers
  //


  const handleDNDConsider = (e: any) => {
    blocks = e.detail.items;
  }

  const handleDNDFinalize = (e: any) => {
    isDirty = true;
    blocks = e.detail.items;
    if(module.projectsCount > 0 && warnAboutDrop){
      showWarnAboutDrop = true;
    }
  }

  const updateModule = async () => {
    try{
      loading = true;
      await BlocksAPI.unlinkAllBlocksOnAModule(module.id);
      for(let i = 0; i < blocks.length; i++){
        await BlocksAPI.linkBlockToModule(module.id, blocks[i].id, i);
      }
      success("Saved!", "That module has been updated!");
    }catch(err){
      error("", "Could not save that module!");
    }finally{
      loading = false;
    }
  };

</script>

<div class="project-flow-editor-module-container">
  <div class="row">
    <div class="col-10">
      <strong class={module.status === "disabled" ? "text-danger" : module.status === "pending" ? "text-warning" : ""}>
        {module.name} {module.status !== "active" ? `(${module.status})` : ""}
      </strong>
    </div>
    <div class="col-1">
      <Icon name="arrow-clockwise" onclick={refreshBlockList} />
    </div>
    <div class="col-1">
      <Icon name={expanded ? "caret-down-fill" : "caret-right-fill"} onclick={toggleList} />
    </div>
  </div>
  {#if expanded}
    <div class="row">
      <div class="col-12">
        {#if loading}
          <Loading />
        {:else if !hasLoadedData}
          Not Loaded
        {:else}
          <div class="row">
            <div class="col-5 offset-1">
              <em>In {module.projectsCount} projects</em>
            </div>
            <div class="col-6">
              <select class="form-control" value={module.status} on:change={changeModuleStatus}>
                <option value="active">Status: Active</option>
                <option value="pending">Status: Pending</option>
                <option value="disabled">Status: Disabled</option>
              </select>
            </div>
          </div>

          <div id="blocks-all" class="row-dropper"  use:dndzone="{{items:blocks, flipDurationMs, dropTargetClasses:["drop-target-level-2"], type:"block"}}" on:consider={handleDNDConsider} on:finalize={handleDNDFinalize}>
            {#each blocks as block (block.id)}
              <div class="row" id={block.id}>
                <div class="col-10 offset-1">
                  {block.name}
                </div>
                <div class="col-1">
                  <Icon name="eye-fill" onclick={() => selectBlock(block)} />
                </div>
              </div>
            {/each}
          </div>
          {#if isDirty}
            <div class="row">
              <div class="col-10 offset-1">
                <button class="btn btn-block btn-primary" on:click={updateModule}>Update Module</button>
              </div>
            </div>
          {/if}
        {/if}

      </div>
    </div>
    {#if showPreview}
      <Modal isOpen={showPreview} toggle={togglePreview} size="xl">
        <ModalHeader toggle={togglePreview}>Previewing Block</ModalHeader>
        <ModalBody>
          <BlockContentViewer block={selectedBlock} />
        </ModalBody>
      </Modal>
    {/if}
    {#if showWarnAboutDrop}
      <Modal isOpen={showWarnAboutDrop} toggle={toggleWarn} size="s">
        <ModalHeader toggle={toggleWarn}>Warning!</ModalHeader>
        <ModalBody>
          <div class="row">
            <div class="col-12">
              <strong class="text-danger">Warning:</strong> This module is in at least one project already. If you save this, it will update the module across all projects. Depending on the projects, this may cause study protocol issues. Please make sure you know what you are doing here.
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <button class="btn btn-block btn-primary" on:click={toggleWarn}>Acknowledged</button>
          <button class="btn btn-block btn-primary" on:click={() => {
            showWarnAboutDrop = false; 
            warnAboutDrop = false; 
          }}>Acknowledged and Don't Warn About This Module</button>
        </ModalFooter>
      </Modal>
    {/if}
  {/if}
</div>