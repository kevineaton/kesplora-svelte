<script lang="ts">
  import { onMount } from "svelte";
  import { Accordion, AccordionItem, Icon } from "sveltestrap";
  import { DateTime } from "luxon";
  import { ProjectsAPI } from "../../api/participant";
  import { BlockContentViewerExternal, BlockContentViewerFile, BlockContentViewerForm, BlockContentViewerEmbed, BlockContentViewerText } from "../../structure/BlockContent";
  import { Card, Screen } from "../../structure";
  import { processFlow } from "../../utils/flowHelpers";

  // This is a pretty large file, as this is the bulk of the participant experience.
  // Effectively, this is where the participants in a study will spend most of their time
  // completing the research project. Therefore, we need to keep in mind the user state,
  // the status of each block, and the completed flows. In the future, we may add
  // project fields to determine whether to restrict access, but for now, a user
  // can go in any order they want.

  // TODO: move the viewer switch to the BlockContentViewer

  export let projectId = 0;
  let loading = true;
  let project = null;
  let flow: any = {};
  let selectedBlock = null;

  // we need a hack to determine which tab is active, so we store
  // them in an object of moduleId: active and make it reactive;
  // it would be better if we could just rely on the flow[id].active flag
  // but that doesn't trigger the response
  let tabs = {}; // string moduleId: boolean active
  let activeTab = "0"; // will be the moduleId in the flow, which when looping over keys turns to a string
  $: tabs = setActiveTab(activeTab);

  // get the flow and put the participant where they need to be
  onMount(async () => {
    try {
      const partProjResult = await ProjectsAPI.getProject(projectId);
      const flowResult = await ProjectsAPI.getProjectFlow(projectId);
      flow = processFlow(flowResult.body.data);
      project = partProjResult.body.data;
      selectFirstNonCompleteBlock()
      loading = false;
    }catch(err){
      console.log(err);
      // redirect to the project back
      // navigate(`/participant/projects/${projectId}`, {replace: true });
    }
  })

  // select a block; this isn't as simple as assigning a selected block, since we need to update the server
  // with the participant's status
  const selectBlock = async (block) => {
    try{
      const result = await ProjectsAPI.getProjectModuleBlock(projectId, block.moduleId, block.id);
      // since we received it, mark it as started if it isn't already
      let sb = result.body.data;
      sb.moduleId = block.moduleId; // this is needed since the API doesn't return the module id and we need it for status
      if(sb.userStatus === "not_started"){
        await ProjectsAPI.updateProjectModuleBlockStatus(projectId, block.moduleId, block.id, "started");
        // we need to update the whole list as well
        updateFlowWithStatusChange(block.moduleId, block.id, "started");  
        sb.userStatus = "started";
        sb.lastUpdated = DateTime.now().toISO();      
      }
      selectedBlock = sb
      
    }catch(err){
      console.log(err);
    }
  }

  const markStatusCompleted = async () => {
    loading = true;
    try{
      await ProjectsAPI.updateProjectModuleBlockStatus(projectId, selectedBlock.moduleId, selectedBlock.id, "completed");
      updateFlowWithStatusChange(selectedBlock.moduleId, selectedBlock.id, "completed");
      const sb = selectedBlock;
      sb.userStatus = "completed";
      sb.lastUpdatedOn = DateTime.now().toISO();
      selectedBlock = sb;
      checkModuleComplete(selectedBlock.moduleId);
    }catch(err){
      console.log(err);
    } finally {
      loading = false;
    }
  }

  const markStatusNotStarted = async () => {
    loading = true;
    try{
      await ProjectsAPI.updateProjectModuleBlockStatus(projectId, selectedBlock.moduleId, selectedBlock.id, "started");
      updateFlowWithStatusChange(selectedBlock.moduleId, selectedBlock.id, "started");
      const sb = selectedBlock;
      sb.userStatus = "started";
      sb.lastUpdatedOn = DateTime.now().toISO();
      flow[selectedBlock.moduleId].status = "started";
      flow[selectedBlock.moduleId].active = true;
      activeTab = selectedBlock.moduleId + "";
      flow = flow;
      selectedBlock = sb;
      // selectBlock(sb);
    }catch(err){
      console.log(err);
    }finally {
      loading = false;
    }
  }

  const submitFormResponse = async () => {
  }

  const updateFlowWithStatusChange = (moduleId: number, blockId: number, newStatus: string) => {
    const blocks: any[] = [];
    flow[moduleId].blocks.forEach((b) => {
      if(b.blockId === blockId){
        b.userStatus = newStatus
        b.lastUpdatedOn = DateTime.now().toISO();
      }
      blocks.push(b);
    })
    flow[moduleId].blocks = blocks;
    flow = flow;
  }

  // this will loop and put the participant on the first block that they have not completed, even if
  // in a different module
  const selectFirstNonCompleteBlock = () => {
    const modules = Object.keys(flow);
    let foundBlock = false;
    for(const moduleId of modules){
      for(const block of flow[moduleId].blocks){
        if(block.userStatus !== "completed"){
          activeTab = moduleId;
          selectBlock(block);
          foundBlock = true;
          break;
        }
      }
      if(foundBlock){
        break;
      }
    }
    // if we didn't find a block, they are done!
    if(!foundBlock){
      projectIsComplete();
    }
  }

  const checkModuleComplete = (moduleId) => {    
    // figure out if this is the last of the blocks; if so,
    // update the module status and move to the next module
    // only if all blocks are completed in a module
    let allComplete = true;
    for(let i = 0; i < flow[moduleId].blocks.length; i++){
      if(flow[moduleId].blocks[i].userStatus !== "completed"){
        // we found a previously non-completed block, so set it here
        allComplete = false;
        break;
      }
    }
    if(allComplete){
        flow[moduleId].status = "completed";
        flow = flow;
    }
    // now check the active
    selectFirstNonCompleteBlock();
  }


  const setActiveTab = (newActiveModuleId: string) => {
    const ret: any = {};
    Object.keys(flow).forEach((moduleId) => {
      ret[parseInt(moduleId)] = moduleId === newActiveModuleId;
    })
    return ret;
  }

  const projectIsComplete = async () => {
    console.log("TODO: Implement")
    activeTab = "-1"
  }
</script>

<Screen { loading } >
  <div class="row">
    <h1>{project.name}</h1>
  </div>
  <div class="row">
    <div class="col-4">
      <Accordion stayOpen>
        {#each Object.keys(flow) as moduleId}
          <AccordionItem 
            active={tabs[moduleId]} 
            header={flow[moduleId].name} 
            class={`flow-module-status-${flow[moduleId].status}`}>
            {#each flow[moduleId].blocks as block}
              <div class="row">
                <div class="col-3 offset-1">
                  {#if block.userStatus === "completed"}
                    <Icon name="check" />
                  {:else if block.userStatus === "started"}
                    <Icon name="app-indicator" />
                  {:else}
                    <Icon name="app" />
                  {/if}
                </div>
                <div class="col-7">
                  {block.blockName}
                </div>
                <div class="col-1">
                  <Icon name="arrow-right" class="link" onclick={() => { selectBlock(block)}} />
                </div>
              </div>
            {/each}
          </AccordionItem>
        {/each}
      </Accordion>
    </div>

    <div class="col-8">
      {#if selectedBlock === null}
        <Card title="" { loading }>
          <strong>Please select a piece of content on the left</strong>
        </Card>
      {:else}
      <Card title={selectedBlock.name} { loading }>
        {#if selectedBlock}
          <div class="row">
            <div class="col-12">
              {selectedBlock.summary}
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              {#if selectedBlock.blockType === "embed"}
              <BlockContentViewerEmbed content={selectedBlock.content}/>
              {:else if selectedBlock.blockType === "external"}
                <BlockContentViewerExternal content={selectedBlock.content}/>
              {:else if selectedBlock.blockType === "file"}
                <BlockContentViewerFile content={selectedBlock.content}/>
              {:else if selectedBlock.blockType === "form"}
                <BlockContentViewerForm projectId={projectId} block={selectedBlock} onCompleted={markStatusCompleted} onReset={markStatusNotStarted} />
              {:else if selectedBlock.blockType === "text"}
                <BlockContentViewerText content={selectedBlock.content}/>
              {/if}
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              {#if selectedBlock.blockType !== "form"}
                {#if selectedBlock.userStatus === "started"}
                  <button class="btn btn-block btn-success" on:click={markStatusCompleted}>Mark Complete</button>
                {:else if selectedBlock.userStatus === "completed"}
                  <button class="btn btn-block btn-info" on:click={markStatusNotStarted}>Reset</button>
                  <span class="text-small">Completed {DateTime.fromISO(selectedBlock.lastUpdatedOn).toLocaleString(DateTime.DATETIME_FULL)}</span>
                {/if}
              {/if}
            </div>
          </div>
        {:else}
          <strong>Please select a piece of content on the left</strong>
        {/if}
      </Card>
      {/if}
    </div>
  </div>
</Screen>