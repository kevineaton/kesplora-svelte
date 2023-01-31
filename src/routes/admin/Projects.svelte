<script lang="ts">
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";
  import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  import { ProjectsAPI } from "../../api/admin";
  import { Card, error, Screen, success } from "../../structure";
  import MarkdownEditor from "../../structure/MarkdownEditor.svelte";

  export const location: any = null;
  
  let loading = false;
  let projectLoading = false;
  let projects: any[] = [];
  let selectedProject: any = null;
  let consentForm: any = {
    projectId: 0,
    contentInMarkdown: "",
    contactInformationDisplay: "",
    institutionInformationDisplay: "",
  };

  let showNewProjectModal = false;
  let newProjectName = "";
  let newProjectSignupCode = "";
  let newProjectShowStatus = "site";
  let newProjectSignupStatus = "closed";

  let showProjectShortDescriptionEditModal = false;
  let showProjectFullDescriptionEditModal = false;
  let showProjectConsentFormModal = false;

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

  const toggleProjectConsentFormModal = () => {
    showProjectConsentFormModal = !showProjectConsentFormModal;
  }

  const handleConsentFormUpdates = (field: string, val: string) => {
    consentForm[field] = val;
    consentForm = consentForm;
  }

  const handleProjectFieldChanges = (field: string, val: string) => {
    selectedProject[field] = val;
    selectedProject = selectedProject;
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
      showNewProjectModal = false;
    }catch(err){
      error("", "Could not create that project. Check your data and try again!");
    } finally {
      loading = false;
    }
  }

  const selectProject = async (newSelectedProject: any) => {
    selectedProject = newSelectedProject;
    selectedProject.hasParticipants = selectedProject.participantCount > 0;
    // we need to get the consent form
    projectLoading = true;
    try{
      const result = await ProjectsAPI.getProjectConsentForm(selectedProject.id);
      consentForm = result.body.data;
    }catch(err){
      // fail silently, in case there simply isn't one yet
    }finally {
      projectLoading = false;
    }
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
      await ProjectsAPI.saveProjectConsentForm(selectedProject.id, consentForm);
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
        <Card title={`Editing ${selectedProject.name}`} loading={projectLoading}>
          <div class="form-group">
            {#if selectedProject.hasParticipants}
              <strong class="text-warning">Warning:</strong> Project currently has {selectedProject.participantCount} participant(s). Some fields can no longer be changed.
            {/if}
          </div>
          <div class="form-group">
            <label for="selectedProject.name}">Project Name</label>
            <input type="text" id="selectedProject.name}" bind:value={selectedProject.name} class="form-control" disabled={selectedProject.hasParticipants} />
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
            <input type="text" id="selectedProject.participantMinimumAge" bind:value={selectedProject.participantMinimumAge} class="form-control" disabled={selectedProject.hasParticipants} />
          </div>
          <div class="form-group">
            <button class="btn btn-block btn-primary" on:click={toggleProjectFullDescriptionModal}>Edit Full Description</button>
          </div>
          <div class="form-group">
            <button class="btn btn-block btn-primary" on:click={toggleProjectShortDescriptionModal}>Edit Short Description</button>
          </div>
          <div class="form-group">
            <button class="btn btn-block btn-primary" on:click={toggleProjectConsentFormModal} disabled={selectedProject.hasParticipants} >Edit Consent Form</button>
          </div>
          <div class="form-group">
            <button class="btn btn-block btn-primary" on:click={saveProject}>Save Changes</button>
          </div>
          <div class="form-group">
            {#if selectedProject.hasParticipants}
              <button class="btn btn-block btn-primary" disabled={true}>Manage Modules</button>
            {:else}
              <Link to={`/admin/projects/${selectedProject.id}/flow`} class="btn btn-block btn-primary">Manage Modules</Link>
            {/if}
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
      <MarkdownEditor content={selectedProject.shortDescription} handleChange={(e) => {handleProjectFieldChanges("shortDescription", e.target.value)}} mode="edit" />
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={toggleProjectShortDescriptionModal}>Done</button>
    </ModalFooter>
  </Modal>

  <Modal isOpen={showProjectFullDescriptionEditModal} toggle={toggleProjectFullDescriptionModal} fullscreen={true}>
    <ModalHeader toggle={toggleProjectFullDescriptionModal}>Editing Full Description</ModalHeader>
    <ModalBody>
      <MarkdownEditor content={selectedProject.description} handleChange={(e) => {handleProjectFieldChanges("description", e.target.value)}} mode="edit" />
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={toggleProjectFullDescriptionModal}>Done</button>
    </ModalFooter>
  </Modal>


  <Modal isOpen={showProjectConsentFormModal} toggle={toggleProjectConsentFormModal} fullscreen={true}>
    <ModalHeader toggle={toggleProjectConsentFormModal}>Consent Form</ModalHeader>
    <ModalBody>
      <div class="row">
        <div class="col-12">
          <label for="consent.contentInMarkdown">Primary Content</label>
          <MarkdownEditor content={consentForm.contentInMarkdown} mode="edit" handleChange={(e) => {handleConsentFormUpdates("contentInMarkdown", e.target.value)}}  />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <label for="consent.contactInformationDisplay">Contact Information</label>
          <span class="small">This will be appended under the primary content.</span>
          <MarkdownEditor content={consentForm.contactInformationDisplay} mode="edit" handleChange={(e) => {handleConsentFormUpdates("contactInformationDisplay", e.target.value)}}  />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <label for="consent.institutionInformationDisplay">Institutional Information</label>
          <span class="small">This will be appended under the contact information.</span>
          <MarkdownEditor content={consentForm.institutionInformationDisplay} mode="edit" handleChange={(e) => {handleConsentFormUpdates("institutionInformationDisplay", e.target.value)}} />
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-primary" on:click={toggleProjectConsentFormModal}>Done</button>
    </ModalFooter>
  </Modal>
</Screen>