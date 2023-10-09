<script lang="ts">
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { ModulesAPI } from "../../api/admin";
  import { Card, error, Screen, success } from "../../structure";
  import MarkdownEditor from "../../structure/MarkdownEditor.svelte";

  export const location: any = null;
  
  let loading = false;
  let modules: any[] = [];
  let selectedModule: any = null;

  let showNewModuleModal = false;
  let newModuleName = "";

  let showDescriptionEditModal = false;

  onMount(async () => {
    try{
      loading = true;
      const result = await ModulesAPI.getModules();
      modules = result.body.data;
      loading = false;
    } catch(err){}
  })

  const toggleNewModuleModal = () => {
    showNewModuleModal = !showNewModuleModal;
  }

  const toggleDescriptionModal = () => {
    showDescriptionEditModal = !showDescriptionEditModal;
  }

  const updateDescription = (content: string) => {
    selectedModule.description = content;
  }

  const createModule = async () => {
    if(newModuleName === ""){
      return error("Missing Name", "Name is required!");
    }
    loading = true;
    const data = {
      name: newModuleName,
    }
    try{
      const result = await ModulesAPI.createModule(data);
      modules.push(result.body.data);
      selectModule(result.body.data);
      showDescriptionEditModal = false;
      showNewModuleModal = false;
      newModuleName = "";
    }catch(err){
      error("", "Could not create that module. Check your data and try again!");
    } finally {
      loading = false;
    }
  }

  const selectModule = (newSelectedModule: any) => {
    selectedModule = newSelectedModule;
  }

  const saveModule = async () => {
    if(selectedModule.name === ""){
      return error("Missing Name", "Name is required");
    }
    loading = true;
    try{
      await ModulesAPI.updateModule(selectedModule.id, selectedModule);
      success("", "Module saved!");
    }catch(err){
      error("", "Could not save that module. Please try again.")
    } finally {
      loading = false;
    }
  }
</script>

<Screen>
  <div class="row">
    <div class="col-3">
      <Card title="About Modules">
        Modules are containers for blocks. They are organized in a specific order and can be shared between projects.
      </Card>
    </div>
    <div class="col-4">
      <Card title="Modules" {loading}>
        {#if modules.length === 0}
          <strong>No Modules available.</strong>
        {:else}
          {#each modules as module (module.id)}
            <div class="row project-list-row">
              <div class="col-8">
                {module.name}
              </div>
              <div class="col-3">
                {module.status}
              </div>
              <div class="col-1">
                <Icon name="pencil-fill" onclick={() => selectModule(module)} />
              </div>
            </div>
          {/each}
        {/if}
        <button class="btn btn-block btn-primary" on:click={toggleNewModuleModal}>New</button>
      </Card>
    </div>
    <div class="col-5">
      {#if selectedModule !== null}
        <Card title={`Editing ${selectedModule.name}`} {loading}>
          <div class="form-group">
            <label for="selectedModule.name}">Module Name</label>
            <input type="text" id="selectedModule.name}" bind:value={selectedModule.name} class="form-control" />
          </div>
          <div class="form-group">
            <label for="selectedModule.status">Status</label>
            <select id="selectedModule.status" bind:value={selectedModule.status} class="form-control">
              <option value="pending">Pending Set Up</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div class="form-group">
            <button class="btn btn-block btn-primary" on:click={toggleDescriptionModal}>Edit Description</button>
          </div>
          <div class="form-group">
            <button class="btn btn-block btn-primary" on:click={saveModule}>Save Changes</button>
          </div>
          <div class="form-group">
            <Link to={`/admin/modules/${selectedModule.id}/blocks`} class="btn btn-block btn-primary">Manage Blocks</Link>
          </div>
        </Card>
      {/if}
    </div>
  </div>

  <Modal isOpen={showNewModuleModal} toggle={toggleNewModuleModal}>
    <ModalHeader toggle={toggleNewModuleModal}>Create New Module</ModalHeader>
    <ModalBody>
      <div class="form-group">
        <label for="newProjectName">Module Name</label>
        <input type="text" id="newProjectName" bind:value={newModuleName} class="form-control" />
      </div>
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={createModule}>Create Module</button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={showDescriptionEditModal} toggle={toggleDescriptionModal} fullscreen={true}>
    <ModalHeader toggle={toggleDescriptionModal}>Editing Description</ModalHeader>
    <ModalBody>
      <MarkdownEditor content={selectedModule.description} mode="edit" handleChange={(e) => {updateDescription(e.target.value)}} />
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={toggleDescriptionModal}>Done</button>
    </ModalFooter>
  </Modal>
</Screen>