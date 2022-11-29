<script lang="ts">
  import { onMount } from "svelte";
  import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { BlocksAPI, ModulesAPI, ProjectsAPI } from "../api";
  import { Card, error, Screen, success, warning } from "../structure";
  import MarkdownEditor from "../structure/MarkdownEditor.svelte";
  import { BlockExternalEdit, BlockPresentationEdit, BlockTextEdit } from "./BlockContent";
  
  export const location: any = null;
  
  let loading = false;
  let blocks: any[] = [];
  let selectedBlock: any = null;

  let showNewBlockModal = false;
  let newBlockType: "text" | "external" | "presentation" | "survey" = "text";
  let newBlock: any = {
    name: "",
    summary: "",
    content: {},
  };

  let showDeleteModal = false;
  let showEditModal = false;

  onMount(async () => {
    try{
      loading = true;
      const result = await BlocksAPI.getBlocks();
      blocks = result.body.data;
      loading = false;
    } catch(err){}
  })

  const toggleNewBlockModal = () => {
    showNewBlockModal = !showNewBlockModal;
  }

  const toggleDeleteBlockModal = (newSelectedBlock?: any) => {
    showDeleteModal = !showDeleteModal;
    selectedBlock = newSelectedBlock;
  }

  const toggleEditBlockModal = () => {
    showEditModal = !showEditModal;
  }

  const createBlock = async () => {
    newBlock.content = newBlock.content;
    if(newBlock.name === ""){
      return error("Missing Name", "Name is required!");
    }
    if(newBlock.summary === ""){
      return error("Missing Summary", "Summary is required!");
    }
    loading = true;
    try{
      const result = await BlocksAPI.createBlock(newBlockType, newBlock);
      blocks = [result.body.data, ...blocks];
      showNewBlockModal = false;
      success("", "Block saved! It is at the top of the list for you.");
    }catch(err){
      error("", "Could not create that block. Check your data and try again!");
    } finally {
      loading = false;
    }
  }

  const selectBlock = async (newSelectedBlock: any) => {
    selectedBlock = newSelectedBlock;
    // we need to GET the data, since the large get doesn't get all the content
    try {
      const result = await BlocksAPI.getBlock(selectedBlock.id);
      selectedBlock = result.body.data;
    }catch(err){
      warning("Warning", "We could not find the content for that block. It may no longer be available. If you continue to save, the content will be updated and replaced.")
    }
    finally{
      console.log(selectedBlock);
      loading = false;
      showEditModal = true;
    }
  }

  const saveBlock = async () => {
    if(selectedBlock.name === ""){
      return error("Missing Name", "Name is required");
    }
    if(selectedBlock.summary === ""){
      return error("Missing Summary", "Summary is required");
    }
    loading = true;
    try{
      const result = await BlocksAPI.updateBlock(selectedBlock.id, selectedBlock);
      const newBlocks: any[] = [];
      for(const b of blocks){
        if(b.id !== selectedBlock.id){
          newBlocks.push(b)
        } else {
          newBlocks.push(result.body.data);
        }
      }
      blocks = newBlocks;
      success("", "Block saved!");
    }catch(err){
      error("", "Could not save that block. Please try again.")
    } finally {
      loading = false;
    }
  }

  const deleteBlock = async () => {
    try{
      loading = true;
      await BlocksAPI.deleteBlock(selectedBlock.id);
      showDeleteModal = false;
      const newBlocks: any[] = [];
      for(const b of blocks){
        if(b.id !== selectedBlock.id){
          newBlocks.push(b)
        }
      }
      blocks = newBlocks;
    }catch(err){
      error("", "Could not delete that block.");
    }finally {
      loading = false;
    }
  }

</script>

<Screen>
  <div class="row">
    <div class="col-3">
      <Card title="About Blocks">
        Blocks are the individual pieces of content in a research project. These can include surveys, presentations, and external links. Blocks are placed in modules and then modules are combined into projects.
      </Card>
    </div>
    <div class="col-9">
      <Card title="Blocks" {loading}>
        {#if blocks.length === 0}
          <strong>No Blocks available.</strong>
        {:else}
          <div class="row row-header project-list-row">
            <div class="col-2">
              Name
            </div>
            <div class="col-2">
              Type
            </div>
            <div class="col-4">
              Summary
            </div>
            <div class="col-2">
              In Modules
            </div>
            <div class="col-1">
              
            </div>
            <div class="col-1">
              
            </div>
          </div>
          {#each blocks as block (block.id)}
            <div class="row project-list-row">
              <div class="col-2">
                {block.name}
              </div>
              <div class="col-2">
                {block.blockType}
              </div>
              <div class="col-4">
                {block.summary}
              </div>
              <div class="col-2">
                {block.foundInFlows}
              </div>
              <div class="col-1">
                <Icon name="pencil-fill" onclick={() => selectBlock(block)} />
              </div>
              <div class="col-1">
                <Icon name="x-lg" class="text-danger" onclick={() => toggleDeleteBlockModal(block)} />
              </div>
            </div>
          {/each}
        {/if}
        <button class="btn btn-block btn-primary" on:click={toggleNewBlockModal}>New</button>
      </Card>
    </div>
  </div>

  <Modal isOpen={showNewBlockModal} toggle={toggleNewBlockModal} size="xl">
    <ModalHeader toggle={toggleNewBlockModal}>Create New Block</ModalHeader>
    <ModalBody>
      <div class="row">
        <div class="col-2">
          <div class="form-group">
            <label for="newBlockType">Block Type</label>
            <select id="newBlockType" bind:value={newBlockType} class="form-control">
              <option value="text">Text </option>
              <option value="external">External Resource / Link </option>
              <option value="presentation">Embedded Presentation </option>
              <option value="survey" disabled={true}>Survey </option>
            <select>
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="newBlock.name">Name</label>
            <input type="text" id="newBlock.name" bind:value={newBlock.name} class="form-control" />
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="newBlock.summary">Summary</label>
            <textarea type="text" id="newBlock.summary" bind:value={newBlock.summary} class="form-control" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          {#if newBlockType === "text"}
            <BlockTextEdit content={newBlock.content}/>
          {:else if newBlockType === "external"}
            <BlockExternalEdit content={newBlock.content}/>
          {:else if newBlockType === "presentation"}
            <BlockPresentationEdit content={newBlock.content}/>
          {/if}
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={createBlock}>Create Module</button>
    </ModalFooter>
  </Modal>


  <Modal isOpen={showEditModal} toggle={toggleEditBlockModal} size="xl">
    <ModalHeader toggle={toggleEditBlockModal}>Editing {selectedBlock.name}</ModalHeader>
    <ModalBody>
      <div class="row">
        <div class="col-2">
          <div class="form-group">
            <label for="selectedBlock.blockType">Block Type</label>
            <select id="selectedBlock.blockType" bind:value={selectedBlock.blockType} class="form-control">
              <option value="text">Text </option>
              <option value="external">External Resource / Link </option>
              <option value="presentation">Embedded Presentation </option>
              <option value="survey" disabled={true}>Survey </option>
            <select>
          </div>
        </div>
        <div class="col-4">
          <div class="form-group">
            <label for="selectedBlock.name">Name</label>
            <input type="text" id="selectedBlock.name" bind:value={selectedBlock.name} class="form-control" />
          </div>
        </div>
        <div class="col-6">
          <div class="form-group">
            <label for="selectedBlock.summary">Summary</label>
            <textarea type="text" id="selectedBlock.summary" bind:value={selectedBlock.summary} class="form-control" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          {#if newBlockType === "text"}
            <BlockTextEdit content={selectedBlock.content}/>
          {:else if newBlockType === "external"}
            <BlockExternalEdit content={newBlock.content}/>
          {:else if newBlockType === "presentation"}
            <BlockPresentationEdit content={newBlock.content}/>
          {/if}
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={saveBlock}>Save Module</button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={showDeleteModal} toggle={toggleDeleteBlockModal}>
    <ModalHeader toggle={toggleDeleteBlockModal}>Delete Block</ModalHeader>
    <ModalBody>
      <strong class="text-danger">Warning: </strong> You are about to delete the <em>{selectedBlock.name}</em> block. It is currently found in {selectedBlock.foundInFlows} modules.
      Deleting the block will remove it from all modules. This will not remove any external files or links. This cannot be undone. Are you absolutely sure you want to do this?
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-danger" on:click={deleteBlock}>I Confirm</button>
    </ModalFooter>
  </Modal>
</Screen>