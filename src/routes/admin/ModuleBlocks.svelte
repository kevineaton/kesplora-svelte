<script lang="ts">
  import { onMount } from "svelte";
  import { Icon, Modal, ModalHeader, ModalBody, ModalFooter } from "sveltestrap";
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import { BlocksAPI, ModulesAPI } from "../../api/admin";
  import { Card, error, Screen, success } from "../../structure";
  import BlockContentViewer from "../../structure/BlockContentViewer.svelte";
    import { Link } from "svelte-routing";

  export let moduleId;

  const flipDurationMs = 300;
  
  let loading = false;
  let module: any = {};
  let blocksInModule: any[] = [];
  let allBlocks: any[] = [];
  let showBlockPreview = false;
  let selectedBlock = {
    name: "",
    summary: "",
    blockType: "text",
    content: {},
  }

  onMount(async () => {
    try{
      const moduleResult = await ModulesAPI.getModule(moduleId);
      module = moduleResult.body.data;
      const moduleBlocksResult = await BlocksAPI.getBlocksOnModule(moduleId);
      blocksInModule = moduleBlocksResult.body.data;
      const allBlocksResult = await BlocksAPI.getBlocks();
      allBlocks = allBlocksResult.body.data;
      loading = false;
    }catch(err){
      loading = false;
    }
  });

  const handleDNDConsiderInModule = (e: any) => {
    blocksInModule = e.detail.items;
  }

  const handleDNDFinalizeInModule = (e: any) => {
    blocksInModule = e.detail.items;
  }

  const handleDNDConsiderAll = (e: any) => {
    allBlocks = e.detail.items;
  }

  const handleDNDFinalizeAll = (e: any) => {
    allBlocks = e.detail.items;
  }

  const togglePreview = () => {
    showBlockPreview = !showBlockPreview;
  }

  const removeFromModule = (block: any) => {
    const i: any[] = [];
    for(const b of blocksInModule){
      if(b.id !== block.id){
        i.push(b);
      }
    }
    blocksInModule = i;
  };

  const saveOrder = async () => {
    // we are going to loop and make a PUT for each one; in the future, maybe the API could build a batch call?
    loading = true;
    try{
      await BlocksAPI.unlinkAllBlocksOnAModule(moduleId);
      // first, remove all existing links
      for(let i = 0; i < blocksInModule.length; i++){
        await BlocksAPI.linkBlockToModule(moduleId, blocksInModule[i].id, i);
      }
      success("", "Order saved!");
    }catch(err){
      error("", "Could not save that order");
    }finally{
      loading = false;
    }
  };

  const selectBlockForPreview = async (newSelectedBlock) => {
    try{
      loading = true;
      const result = await BlocksAPI.getBlock(newSelectedBlock.id);
      selectedBlock = result.body.data;
      showBlockPreview = true;
    }catch(err){
      error("", "Could not find that block. Perhaps it was deleted by someone else?");
    }finally{
      loading = false;
    }
  }

</script>

<Screen>
  <div class="row">
    <div class="col-2">
      <Card title={`${module.name}`}>
        {module.description}
      </Card>
    </div>
    <div class="col-5">
      <Card title={`${blocksInModule.length} Blocks In Module`}>
        {#if blocksInModule.length === 0}
          <strong>None!</strong>
        {/if}
        <div id="blocks-in-module" class="row-dropper" use:dndzone="{{items:blocksInModule, flipDurationMs}}" on:consider={handleDNDConsiderInModule} on:finalize={handleDNDFinalizeInModule}>
          {#each blocksInModule as block (block.id)}
            <div class="row block-module-list-row" animate:flip="{{duration: flipDurationMs}}">
              <div class="col-1">
                <Icon name="menu-button-wide" />
              </div>
              <div class="col-6">
                {block.name}
              </div>
              <div class="col-3">
                {block.blockType}
              </div>
              <div class="col-1">
                <Icon name="clipboard2" class="text-primary" onclick={() => {selectBlockForPreview(block)}} />
              </div>
              <div class="col-1">
                <Icon name="x-lg" class="text-danger" onclick={() => {removeFromModule(block)}} />
              </div>
            </div>
          {/each}            
        </div>
        <div class="row block-module-list-row">
          <div class="col-12">
            <button class="btn btn-block btn-primary" on:click={saveOrder}>Save Module Order</button>
          </div>
        </div>
      </Card>
    </div>
    <div class="col-5">
      <Card title="All Available Blocks">
        {#if allBlocks.length === 0}
          <div>
            <div class="row">
              <div class="col-12">
                <strong>None!</strong>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <Link to="/admin/blocks" class="btn btn-primary btn-block">Create</Link>
              </div>
            </div>
          </div>
        {/if}
        <div id="blocks-all" use:dndzone="{{items:allBlocks, flipDurationMs}}" on:consider={handleDNDConsiderAll} on:finalize={handleDNDFinalizeAll}>
          {#each allBlocks as block (block.id)}
            <div class="row block-module-list-row" animate:flip="{{duration: flipDurationMs}}">
              <div class="col-1">
                <Icon name="menu-button-wide" />
              </div>
              <div class="col-6">
                {block.name}
              </div>
              <div class="col-3">
                {block.blockType}
              </div>
              <div class="col-1">
                {block.foundInFlows}
              </div>
              <div class="col-1">
                <Icon name="clipboard2" class="text-primary" onclick={() => {selectBlockForPreview(block)}} />
              </div>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  </div>

  <Modal isOpen={showBlockPreview} toggle={togglePreview} size="xl">
    <ModalHeader toggle={togglePreview}>Preview Block</ModalHeader>
    <ModalBody>
      <BlockContentViewer block={selectedBlock} />
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={togglePreview}>Done</button>
    </ModalFooter>
  </Modal>
</Screen>