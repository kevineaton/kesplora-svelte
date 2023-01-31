<script lang="ts">
  import { onMount } from "svelte";
  import { Icon } from "sveltestrap";
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import { SiteAPI } from "../../api";
  import { BlocksAPI, ModulesAPI, ProjectsAPI } from "../../api/admin";
  import { Card, error, Screen, success } from "../../structure";
  import ProjectFlowEditorModule from "../../structure/ProjectFlowEditorModule.svelte";
  import { Link } from "svelte-routing";

  export let projectId = 0;
  const flipDurationMs = 300;

  let projectLoading = false;
  let project: any = {};
  let consent: any = null;
  let flow = [];
  let didFlowChange = false;

  let allModulesNotInProject = [];
  let allBlocks = [];

  onMount(async () => {
    projectLoading = true;
    try{
      const pResult = await ProjectsAPI.getProject(projectId);
      const pFlowResult = await ProjectsAPI.getProjectFlow(projectId);
      const pConsentResult = await SiteAPI.getProjectConsent(projectId);
      const aMResult = await ModulesAPI.getModules();
      const aBResult = await BlocksAPI.getBlocks();

      project = pResult.body.data;
      consent = pConsentResult.body.data;
      flow = pFlowResult.body.data;
      const allModules = aMResult.body.data;
      allBlocks = aBResult.body.data;

      // for the modules, only show the ones not in the project already in "all"
      // TODO: cleanup
      const deDupedModules: any[] = [];
      for(const m of allModules){
        let found = false;
        for(const f of flow){
          if(f.id === m.id){
            found = true;
            break;
          }
        }
        if(!found){
          deDupedModules.push(m);
        }
      }
      allModulesNotInProject = deDupedModules;
    }catch(err){
      error("", "Could not load the project.")
    }finally {
      projectLoading = false;
    }
  });

  //
  // handle the drag and drop considerations for modules
  //

  const handleDNDConsiderInProject = (e: any) => {
    flow = e.detail.items;
  }

  const handleDNDFinalizeInProject = (e: any) => {
    // we need to find the dropped item and set its project count to ++
    const droppedId = e.detail.info.id;
    const items: any[] = [];
    for(const i of e.detail.items){
      if(i.id === droppedId){
        i.projectsCount++;
      }
      items.push(i);
    }
    flow = items;
    didFlowChange = true;
  }

  const handleDNDConsiderAllModules = (e: any) => {
    allModulesNotInProject = e.detail.items;
  }

  const handleDNDFinalizeAllModules = (e: any) => {
    // we need to find the dropped item and set its project count to --
    const droppedId = e.detail.info.id;
    const items: any[] = [];
    for(const i of e.detail.items){
      if(i.id === droppedId){
        i.projectsCount--;
      }
      items.push(i);
    }
    allModulesNotInProject = items;
  }

  const handleDNDConsiderAllBlocks = (e: any) => {
    allBlocks = e.detail.items;
  }

  const handleDNDFinalizeAllBlocks = (e: any) => {
    allBlocks = e.detail.items;
  }

  const saveFlow = async () => {
    projectLoading = true;
    try{
      await ProjectsAPI.deleteProjectFlow(projectId);
      for(let i = 0; i < flow.length; i++){
        await ModulesAPI.linkModuleToProject(projectId, flow[i].id, i);
      }
      success("", "Saved!");
    }catch(err){
      error("", "Could not save the updated flow!");
    }finally{ 
      projectLoading = false;
    }
  }
</script>

<Screen>
  {#if project.status === "active"}
    <div class="row">
      <div class="col-12">
        <Card>
          <strong class="text-warning">Warning: </strong>This project is currently <strong>active</strong> and has {project.participantCount} participant(s). If you make any changes here, you may be violating your study protocol. Please be sure you know exactly what you are doing. Any substantial changes may influence your study results.
        </Card>
      </div>
    </div>
  {/if}
  <div class="row">
    <div class="col-4">
      <Card title={project.name + " Flow"}>
        {#if consent && consent.contentInMarkdown}
          <div class="row">
            <div class="col-10">
              Consent Form
            </div>
            <div class="col-2">
              <Icon name="pencil" />
            </div>
          </div>
        {:else}
          <strong>No consent form!</strong>
        {/if}
        <div class="row-dropper" use:dndzone="{{items:flow, flipDurationMs, type:"module"}}" on:consider={handleDNDConsiderInProject} on:finalize={handleDNDFinalizeInProject}>
          {#if flow.length === 0}
            <strong>No modules in flow</strong>
          {:else}
            {#each flow as module (module.id)}
              <ProjectFlowEditorModule {module} />
            {/each}
          {/if}
        </div>
        {#if didFlowChange}
          <div class="row">
            <div class="col-12">
              <button class="btn btn-block btn-primary" on:click={saveFlow}>Save Changes</button>
            </div>
          </div>
        {/if}
      </Card>
      
    </div>
    <div class="col-4">
      <Card title="All Available Modules">
        <div id="blocks-all" class="row-dropper"  use:dndzone="{{items:allModulesNotInProject, flipDurationMs, dropTargetClasses:["drop-target-level-1"], type:"module"}}" on:consider={handleDNDConsiderAllModules} on:finalize={handleDNDFinalizeAllModules}>
          {#if allModulesNotInProject.length === 0}
            <div class="row">
              <div class="col-12">
                No modules exist that aren't in your project. You can <Link to="/admin/modules">create</Link> one if you would like.
              </div>
            </div>
          {/if}
          {#each allModulesNotInProject as module (module.id)}
            <ProjectFlowEditorModule {module} />
          {/each}
        </div>
      </Card>
    </div>
    <div class="col-4">
      <Card title="All Available Blocks">
        <div id="blocks-all" class="row-dropper"  use:dndzone="{{items:allBlocks, flipDurationMs, type:"block"}}" on:consider={handleDNDConsiderAllBlocks} on:finalize={handleDNDFinalizeAllBlocks}>
          {#each allBlocks as block (block.id)}
            <div class="row" id={block.id}>
              <div class="col-12">
                {block.name}
              </div>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  </div>
</Screen>