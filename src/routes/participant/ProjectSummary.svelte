<script lang="ts">
  import { onMount } from "svelte";
  import { userStore } from "../../stores";
  import { SiteAPI, UsersAPI } from "../../api";
  import { error, MarkdownEditor } from "../../structure";
  import Screen from "../../structure/Screen.svelte";
  import { Modal, ModalHeader, ModalBody, ModalFooter } from "sveltestrap";
  import { navigate } from "svelte-routing";
  import { ProjectsAPI } from "../../api/participant";


  export let projectId = 0;

  let loading = true;
  let project = null;
  let consentForm = null;
  let showRegisterAndEnrollModal = false;

  let participantId = 0;
  let consentStatus = "accepted";
  let participantComments = "";
  let participantProvidedFirstName = "";
  let participantProvidedLastName = "";
  let participantProvidedContactInformation = "";

  let userEnrollFirstName = "";
  let userEnrollLastName = "";
  let userEnrollEmail = "";
  let userEnrollTitle= "";
  let userEnrollPronouns= "";
  let userEnrollPassword = "";
  let userEnrollDOB = new Date();

  let projectCode = "";

  // post-enroll modals
  let showParticipantCodeModal = false;
  let participantCode = "";

  let showValidateNewUserModal = false;
  let showValideNewUserCode = "0";

  // if the user isn't enrolled in this project or otherwise isn't logged in,
  // make sure the project is enrollable; if so, show the description and then the consent

  onMount(async () => {
    if($userStore && $userStore.id){
      console.log($userStore);
      try {
        const partProjResult = await ProjectsAPI.getProject(projectId);
        // if this didn't throw an error, they are already enrolled, so just
        // redirect them
        navigate(`/participant/projects/${projectId}/flow`, {replace: true });
        return;
      }catch(err){
        console.log(err);
      }
    }
    const pResult = await SiteAPI.getProjectInfo(projectId);
    const cResult = await SiteAPI.getProjectConsent(projectId);
    project = pResult.body.data;
    consentForm = cResult.body.data;
    loading = false;
    if(project.participantVisibility !== "code" && $userStore !== null){
      participantId = $userStore.id;
      participantProvidedFirstName = $userStore.firstName;
      participantProvidedLastName = $userStore.lastName;
      participantProvidedContactInformation = $userStore.email;
    }
  })

  // modal toggles

  const toggleRegisterAndEnrollForm = () => {
    showRegisterAndEnrollModal = !showRegisterAndEnrollModal;
  }

  const toggleShowParticipantCodeModal = () => {
    showParticipantCodeModal = !showParticipantCodeModal;
  }

  const toggleShowValidateNewUserModal = () => {
    showValidateNewUserModal = !showValidateNewUserModal;
  }

  const submitConsent = async () => {
    const data = {
      user: {
        title: userEnrollTitle,
        firstName: userEnrollFirstName,
        lastName: userEnrollLastName,
        pronouns: userEnrollPronouns,
        email: userEnrollEmail,
        password: userEnrollPassword,
        dob: userEnrollDOB,
      },
      participantId,
      participantComments,
      participantProvidedContactInformation,
      participantProvidedFirstName,
      participantProvidedLastName,
      consentStatus,
      projectCode,
    };
    if(data.participantProvidedFirstName === "" || data.participantProvidedLastName === "" || data.participantProvidedContactInformation === ""){
      return error("Missing Legal Information", "You must provide your first name, last name, and contact information to sign this consent form.");
    }
    try{
      const result = await SiteAPI.saveProjectConsentResponse(projectId, data);
      const res = result.body.data;      

      // we have a split here; first, if there is a participant code,
      // we need to show that in a new modal with the proper warnings and
      // that modal will have a logout and login buttong
      // otherwise, if a new user was created for this, we need to have them
      // validate their account
      if(res.user && res.user.participantCode){
        // show the info and have them log out and in
        participantCode = res.user.participantCode;
        showRegisterAndEnrollModal = false;
        showParticipantCodeModal = true;
      } else if(res.user && res.user.status === "pending"){
        // TODO: show them a validation form
      } else {
        // TODO: we just redirect to the project
      }
    }catch(err){
      console.log("error")
      console.log(err);
      error("Uh oh!", "We could not enroll you. Check your information and try again.");
    }finally{
      loading = false;
    }
  }

  const logoutAndLogin = async () => {
    loading = true;
    // they may or may not be logged in, so we will wrap it in two
    // separate try/catch blocks
    if($userStore !== null){
      try{
        await UsersAPI.logout();
        window.localStorage.clear();
        $userStore = null;
      }catch(err){
        console.log(err);
      }
    }
    
    try{
      const loginResult = await UsersAPI.login(participantCode, userEnrollPassword);
      userStore.set(loginResult.body.data);
      window.localStorage.setItem("user", JSON.stringify(loginResult.body.data));
      navigate(`/participant/projects/${projectId}/flow`, {replace: true });
    }catch(err){
      console.log(err);
    }finally{
      loading = false;
    }
  }
  
</script>

<Screen { loading } ignoreAuth={true}>
  <div class="row">
    <div class="col-10">
      <h1>{project.name}</h1>
      <MarkdownEditor mode="view" content={project.description} />
    </div>
    <div class="col-2">
      More Information
      <ul>
        <li>Enrollable: {project.signupStatus === "closed" ? "No" : "Yes"}</li>
        <li>Minimum Age: {project.participantMinimumAge === 0 ? "None" : project.participantMinimumAge}</li>
        <li>Visibility Level: {project.participantVisibility === "code" ? "Anonymous" : "Confidential"}</li>
      </ul>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <h1>Consent Form</h1>
      <MarkdownEditor mode="view" content={consentForm.contentInMarkdown} />

      <h1>Contact Information</h1>
      <MarkdownEditor mode="view" content={consentForm.contactInformationDisplay} />

      <h1>Institutional Information</h1>
      <MarkdownEditor mode="view" content={consentForm.institutionInformationDisplay} />
    </div>
  </div>
  <div class="row">
    <div class="col-10 offset-1">
      <p>To participate, you must meet the minimum project requirements and agree to the consent form as provided. You will create an account, which may or may not be anonymous depending on the project requirements, confirm your consent, and then take the next steps in the project.</p>
      <button class="btn btn-block btn-primary" on:click={toggleRegisterAndEnrollForm}>Register and Enroll</button>
    </div>
  </div>


  <Modal isOpen={showRegisterAndEnrollModal} toggle={toggleRegisterAndEnrollForm} size="lg">
    <ModalHeader toggle={toggleRegisterAndEnrollForm}>Enroll</ModalHeader>
    <ModalBody>
      {#if !$userStore}
        <div class="form-group">
          <p>To participate, you must create an account for this site. Depending on the settings of the project, your information may be available to the research team.</p>
        </div>

        {#if project.participantVisibility === "code"}
          <div class="form-group">
            <p>This project will attempt to protect your data to the fullest extent possible. A unique code will be generated for you. You will use that code and the password you provide to login. <strong>You will not be able retrieve this code once it is generated, so please protect it!</strong> Below, you will still need to provide your full legal name and contact information in order to sign the consent form. However, this will not be connected to the new account. If you have any questions at all, please contact the project team.</p>
          </div>
          <div class="form-group">
            <label for="userEnrollPassword">Password</label>
            <input type="password" bind:value={userEnrollPassword} class="form-control" id="userEnrollPassword" />
          </div>
        {:else}
          <div class="form-group">
            <p>This project requires your full information in order to participate.</p>
          </div>
          <div class="form-group">
            <div class="form-group">
              <label for="userEnrollTitle">Title</label>
              <input type="text" bind:value={userEnrollTitle} class="form-control" id="userEnrollTitle" />
            </div>
            <label for="userEnrollFirstName">First Name</label>
            <input type="text" bind:value={userEnrollFirstName} class="form-control" id="userEnrollFirstName" />
          </div>
          <div class="form-group">
            <label for="userEnrollLastName">Last Name</label>
            <input type="text" bind:value={userEnrollLastName} class="form-control" id="userEnrollLastName" />
          </div>
          <div class="form-group">
            <label for="userEnrollPronouns">Pronouns</label>
            <input type="text" bind:value={userEnrollPronouns} class="form-control" id="userEnrollPronouns" />
          </div>
          <div class="form-group">
            <label for="userEnrollEmail">Email</label>
            <input type="text" bind:value={userEnrollEmail} class="form-control" id="userEnrollEmail" />
          </div>
          <div class="form-group">
            <label for="userEnrollPassword">Password</label>
            <input type="password" bind:value={userEnrollPassword} class="form-control" id="userEnrollPassword" />
          </div>
        {/if}
        <hr />
      {/if}
      <div class="form-group">
        <p>You must provide your legal first and last name below as a digital signature stating that you agree to the consent form, do not have any additional questions, understand the potential risks of the project, and otherwise are willing to participate freely. If any of the above is not accurate, please stop and contact the project team.</p>
      </div>
      <div class="form-group">
        <label for="participantProvidedFirstName">First Name</label>
        <input type="text" bind:value={participantProvidedFirstName} class="form-control" id="participantProvidedFirstName" />
      </div>
      <div class="form-group">
        <label for="participantProvidedLastName">Last Name</label>
        <input type="text" bind:value={participantProvidedLastName} class="form-control" id="participantProvidedLastName" />
      </div>
      <div class="form-group">
        <label for="participantProvidedContactInformation">Contact Information</label>
        <input type="text" bind:value={participantProvidedContactInformation} class="form-control" id="participantProvidedContactInformation" />
      </div>
      <div class="form-group">
        <label for="participantComments">Additional Comments</label>
        <input type="text" bind:value={participantComments} class="form-control" id="participantComments" />
      </div>
      {#if project.signupStatus === "with_code"}
        <div class="form-group">
          <label for="projectCode">Project Code</label>
          <input type="text" bind:value={projectCode} class="form-control" id="projectCode" />
          <span class="small">This project requires a code to sign up and should have been provided to you.</span>
        </div>
      {/if}
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-success" on:click={submitConsent}>I Agree to Sign the Consent Form</button>
    </ModalFooter>
  </Modal>


  <Modal isOpen={showParticipantCodeModal} toggle={toggleShowParticipantCodeModal} size="lg">
    <ModalHeader toggle={toggleShowParticipantCodeModal}>Enroll</ModalHeader>
    <ModalBody>
      <p><strong>Congratulations!</strong> You have successfully enrolled in this project! Keep in mind that since this project focuses on trying to ensure confidentiality and protect your data, we have created a new account for you to use in this project. We are showing you your participant code now. <strong class="text-danger">Save this code, as you will never be shown it again!</strong></p>
      <p style="font-weight: bold; text-align: center; font-size: 18px;">{participantCode}</p>
      <p>Once you have saved this code, hit the button below to continue to the project.</p>
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-success" on:click={logoutAndLogin}>Continue</button>
    </ModalFooter>
  </Modal>

</Screen>