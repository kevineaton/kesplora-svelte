<script lang="ts">
  import { onMount } from "svelte";
  import { DateTime } from "luxon";
  import { Modal, ModalHeader, ModalBody, ModalFooter } from "sveltestrap";
    import { ProjectsAPI } from "../../api/participant";
    import { error, success } from "../Alert";
  import BlockContentViewerFormQuestion from "./BlockContentViewerFormQuestion.svelte";
    import { Loading } from "..";

  // this is actually pretty complicated; we wanted to keep forms as blocks for easier flows, but
  // they are inherently more challenging to build out and handle, so a lot of the logic is farmed out
  // here. Depending on the "can reset" and "can resubmit" logic, this UI could be pretty complicated.

  // For v1, there's no resubmissions, so if they submitted the survey, it's just closed

  export let projectId = 0;
  export let block: any;
  if(!block){
    block = {
      content: {},
    }
  }
  export let onCompleted: any = () => {};
  export let onReset: any = () => {};

  let loading = true;
  let existingSubmissions: any[] = [];
  let lastSubmissionTime = "";
  let showSubmitModal = false;
  let showDeleteModal = false;


  // hold of the responses in a JSON object, but keep in mind that since we have to allow multiple choice,
  // the key has to be questionId-optionId, which will be -0 for text and -ID for single or each multiple
  let responses: any = {}; // questionId-optionId: { optionId: text: }

  const handleChange = (data: any = {}) => {
    const response = {
      questionId: data.questionId,
      optionId: 0,
      textResponse: data.response,
    };
    if(data.questionType === "single" || data.questionType === "multiple"){
      response.optionId = parseInt(data.response);
    }
    responses[response.questionId + "-" + response.optionId] = response;
  }

  const submitForm = async () => {
    const data: any[] = [];
    for(const key of Object.keys(responses)){
      data.push(responses[key]);
    }
    // make sure each question has a response until required is implemented
    for(const question of block.content.questions){
      if(question.questionType === "explanation"){
        continue;
      }
      let foundQuestion = false;
      for(const response of data){
        if(response.questionId === question.id){
          foundQuestion = true;
          break;
        }
      }
      if(!foundQuestion){
        toggleSubmitModal();
        return error("All Are Required", "All questions must have a valid response.");
      }
    }
    try {
      loading = true;
      await ProjectsAPI.saveFormSubmission(projectId, block.moduleId, block.id, { responses: data });
      toggleSubmitModal()
      success("Submitted!", "You submission has been saved.")
      onCompleted();
    }catch(err){

    }finally{
      loading = false;
    }
  }

  const resetForm = async () => {
    // delete all submissions and reset
    loading = true;
    toggleDeleteModal();
    try{
      await ProjectsAPI.deleteFormSubmissions(projectId, block.moduleId, block.id);
      existingSubmissions = [];
      lastSubmissionTime = "";
      onReset();
    }catch(err){
      console.log(err);
    }finally{
      loading = false;
    }
  }

  const resubmitForm = async () => {
    // for now, this does the same as reset form, but eventually we want
    // to allow (and show) multiple attempts
    resetForm();
  }

  onMount(async () => {
    try {
      loading = true;
      const result = await ProjectsAPI.getFormSubmissions(projectId, block.moduleId, block.id)
      existingSubmissions = result.body.data;
      // for v1, we just show the results of the submissions
      if(existingSubmissions.length > 0){
        const s = existingSubmissions[0];
        lastSubmissionTime = s.submittedOn;
        for(const question of block.content.questions){
          for(const response of s.responses){
            if(question.id === response.questionId){
              if(!question.responded){
                question.responded = "";
              }
              question.responded += response.textResponse + " ";
              if(question.questionType !== "multiple"){
                break;
              }
            }
          }
        }
      }
    }catch(err){
      console.log(err);
    }finally{
      loading = false;
    }
  })

  const toggleSubmitModal = () => {
    showSubmitModal = !showSubmitModal;
  }
  const toggleDeleteModal = () => {
    showDeleteModal = !showDeleteModal;
  }
</script>

{#if loading}
  <Loading />
{:else}
<div>
  {#each block.content.questions as question}
    {#if existingSubmissions.length > 0}
      <div class="row">
        {#if question.questionType === "explanation"}
          <div class="col-12">
            {question.question}
          </div>
        {:else}
          <div class="col-6">
            {question.question}
          </div>
          <div class="col-6">
            {question.responded}
          </div>
        {/if}
      </div>
    {:else}
      <BlockContentViewerFormQuestion question={question} onChange={handleChange} />
    {/if}
  {/each}
  {#if existingSubmissions.length === 0}
    <button class="btn btn-block btn-success" on:click={toggleSubmitModal}>Submit Form</button>
  {:else}
  <div class="row">
    <div class="col-6">
      Submitted on {DateTime.fromISO(lastSubmissionTime).toLocaleString(DateTime.DATETIME_FULL)}
    </div>
    <div class="col-6">
      {#if block.content.formType === "quiz"}
        Results: {existingSubmissions[0].results}
      {/if}
    </div>
  </div>
    {#if block.content.allowResubmit === "yes" && existingSubmissions.length !== 0}
      <button class="btn btn-block btn-danger" on:click={toggleDeleteModal}>Delete Submissions and Reset</button>
    {:else if block.allowReset === "yes" && existingSubmissions.length !== 0}
      <button class="btn btn-block btn-danger" on:click={toggleDeleteModal}>Delete Submissions and Reset</button>
    {/if}
  {/if}
</div>
{/if}

<Modal isOpen={showSubmitModal} toggle={toggleSubmitModal} size="lg">
  <ModalHeader toggle={toggleSubmitModal}>Submit</ModalHeader>
  <ModalBody>
    <p>Are you sure want to submit this form? This cannot be undone unless the project allows you to resubmit.</p>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-block btn-success" on:click={submitForm}>Yes, Submit My Responses</button>
  </ModalFooter>
</Modal>

<Modal isOpen={showDeleteModal} toggle={toggleDeleteModal} size="lg">
  <ModalHeader toggle={toggleDeleteModal}>Delete and Reset</ModalHeader>
  <ModalBody>
    <p>Are you sure want to delete your responses so you can resubmit? This cannot be undone!</p>
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-block btn-danger" on:click={resetForm}>Yes, Delete My Responses</button>
  </ModalFooter>
</Modal>