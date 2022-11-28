<script lang="ts">
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { ProjectsAPI } from "../api";
  import { Card, error, Screen, success } from "../structure";
  import MarkdownEditor from "../structure/MarkdownEditor.svelte";

  export const location: any = null;
  
  let loading = false;
  let projects: any[] = [];
  let selectedProject: any = null;

  let showNewProjectModal = false;
  let newProjectName = "";
  let newProjectSignupCode = "";
  let newProjectShowStatus = "site";
  let newProjectSignupStatus = "closed";

  let showProjectShortDescriptionEditModal = false;
  let showProjectFullDescriptionEditModal = false;

  onMount(async () => {
    try{
      loading = true;
      const result = await ProjectsAPI.getProjects();
      projects = result.body.data;
      loading = false;
    } catch(err){}
  })

  const toggleNewProjectModal = () => {
    showNewProjectModal = !showNewProjectModal;
  }

  const toggleProjectShortDescriptionModal = () => {
    showProjectShortDescriptionEditModal = !showProjectShortDescriptionEditModal;
  }

  const toggleProjectFullDescriptionModal = () => {
    showProjectFullDescriptionEditModal = !showProjectFullDescriptionEditModal;
  }

  const createProject = async () => {
    if(newProjectName === ""){
      return error("Missing Name", "Name is required!");
    }
    loading = true;
    const data = {
      name: newProjectName,
      shortCode: newProjectSignupCode,
      showStatus: newProjectShowStatus,
      newProjectSignupStatus: newProjectSignupStatus,
    }
    try{
      const result = await ProjectsAPI.createProject(data);
      projects.push(result.body.data);
      selectProject(result.body.data);
    }catch(err){
      error("", "Could not create that project. Check your data and try again!");
    } finally {
      loading = false;
    }
  }

  const selectProject = (newSelectedProject: any) => {
    selectedProject = newSelectedProject;
  }

  const saveProject = async () => {
    if(selectedProject.name === ""){
      return error("Missing Name", "Name is required");
    }
    loading = true;
    selectedProject.maxParticipants = parseInt(selectedProject.maxParticipants);
    selectedProject.participantMinimumAge = parseInt(selectedProject.participantMinimumAge);
    try{
      await ProjectsAPI.updateProject(selectedProject.id, selectedProject);
      success("", "Project saved!");
    }catch(err){
      error("", "Could not save that project. Please try again.")
    } finally {
      loading = false;
    }
  }
</script>

<Screen>
  <div class="row">
    <div class="col-3">
      <Card title="About Projects">
        Projects are the primary entity that represents a research project or goal. Projects contain modules which participants will go through in order. Each module will consist of one or more blocks. Blocks contain things like presentations or surveys.
      </Card>
    </div>
    <div class="col-4">
      <Card title="Projects" {loading}>
        {#if projects.length === 0}
          <strong>No projects available.</strong>
        {:else}
          {#each projects as project (project.id)}
            <div class="row project-list-row">
              <div class="col-8">
                {project.name}
              </div>
              <div class="col-3">
                {project.status}
              </div>
              <div class="col-1">
                <Icon name="pencil-fill" onclick={() => selectProject(project)} />
              </div>
            </div>
          {/each}
        {/if}
        <button class="btn btn-block btn-primary" on:click={toggleNewProjectModal}>New</button>
      </Card>
    </div>
    <div class="col-5">
      {#if selectedProject !== null}
        <Card title={`Editing ${selectedProject.name}`} {loading}>
          <div class="form-group">
            <label for="selectedProject.name}">Project Name</label>
            <input type="text" id="selectedProject.name}" bind:value={selectedProject.name} class="form-control" />
          </div>
          <div class="form-group">
            <label for="selectedProject.shortCode">Project Signup Code</label>
            <input type="text" id="selectedProject.shortCode" bind:value={selectedProject.shortCode} class="form-control" />
          </div>
          <div class="form-group">
            <label for="selectedProject.signupStatus">Participants Can Sign Up</label>
            <select id="selectedProject.signupStatus" bind:value={selectedProject.signupStatus} class="form-control">
              <option value="closed">No</option>
              <option value="with_code">With Signup Code</option>
              <option value="open">Openly</option>
            </select>
          </div>
          <div class="form-group">
            <label for="selectedProject.status">Status</label>
            <select id="selectedProject.status" bind:value={selectedProject.status} class="form-control">
              <option value="pending">Pending Launch</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div class="form-group">
            <label for="selectedProject.showStatus">Show Project</label>
            <select id="selectedProject.showStatus" bind:value={selectedProject.showStatus} class="form-control">
              <option value="site">On Main Site</option>
              <option value="direct">Only Directly</option>
              <option value="no">Not To Anyone</option>
            </select>
          </div>
          <div class="form-group">
            <label for="selectedProject.maxParticipants">Maximum Participants</label>
            <input type="text" id="selectedProject.maxParticipants" bind:value={selectedProject.maxParticipants} class="form-control" />
          </div>
          <div class="form-group">
            <label for="selectedProject.participantVisibility">Visibility</label>
            <select id="selectedProject.participantVisibility" bind:value={selectedProject.participantVisibility} class="form-control">
              <option value="code">Anonymous - Code Only</option>
              <option value="email">Confidential - Email Only</option>
              <option value="full">Full Profile</option>
            </select>
          </div>
          <div class="form-group">
            <label for="selectedProject.participantMinimumAge">Minimum Age</label>
            <input type="text" id="selectedProject.participantMinimumAge" bind:value={selectedProject.participantMinimumAge} class="form-control" />
          </div>
          <div class="form-group">
            <button class="btn btn-block btn-primary" on:click={toggleProjectFullDescriptionModal}>Edit Full Description</button>
          </div>
          <div class="form-group">
            <button class="btn btn-block btn-primary" on:click={toggleProjectShortDescriptionModal}>Edit Short Description</button>
          </div>
          <div class="form-group">
            <button class="btn btn-block btn-primary" on:click={saveProject}>Save Changes</button>
          </div>
          <div class="form-group">
            <Link to={`/admin/projects/${selectedProject.id}/flow`} class="btn btn-block btn-primary">Manage Modules</Link>
          </div>
        </Card>
      {/if}
    </div>
  </div>

  <Modal isOpen={showNewProjectModal} toggle={toggleNewProjectModal}>
    <ModalHeader toggle={toggleNewProjectModal}>Create New Project</ModalHeader>
    <ModalBody>
      <div class="form-group">
        <label for="newProjectName">Project Name</label>
        <input type="text" id="newProjectName" bind:value={newProjectName} class="form-control" />
      </div>
      <div class="form-group">
        <label for="newProjecnewProjectSignupCodetName">Project Signup Code</label>
        <input type="text" id="newProjectSignupCode" bind:value={newProjectSignupCode} class="form-control" />
      </div>
      <div class="form-group">
        <label for="newProjectSignupStatus">Participants Can Sign Up</label>
        <select id="newProjectSignupStatus" bind:value={newProjectSignupStatus} class="form-control">
          <option value="closed">No</option>
          <option value="with_code">With Signup Code</option>
          <option value="open">Openly</option>
        </select>
      </div>
      <div class="form-group">
        <label for="newProjectShowStatus">Show Project</label>
        <select id="newProjectShowStatus" bind:value={newProjectShowStatus} class="form-control">
          <option value="site">On Main Site</option>
          <option value="direct">Only Directly</option>
          <option value="no">Not To Anyone</option>
        </select>
      </div>
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={createProject}>Create Project</button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={showProjectShortDescriptionEditModal} toggle={toggleProjectShortDescriptionModal} fullscreen={true}>
    <ModalHeader toggle={toggleProjectShortDescriptionModal}>Editing Short Description</ModalHeader>
    <ModalBody>
      <MarkdownEditor content={selectedProject.shortDescription} mode="edit" />
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={toggleProjectShortDescriptionModal}>Done</button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={showProjectFullDescriptionEditModal} toggle={toggleProjectFullDescriptionModal} fullscreen={true}>
    <ModalHeader toggle={toggleProjectFullDescriptionModal}>Editing Full Description</ModalHeader>
    <ModalBody>
      <MarkdownEditor content={selectedProject.description} mode="edit" />
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={toggleProjectFullDescriptionModal}>Done</button>
    </ModalFooter>
  </Modal>
</Screen>