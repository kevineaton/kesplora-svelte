<script type="ts">
  import { onMount } from "svelte";
  import { Icon, Modal, ModalBody, ModalFooter, ModalHeader, TabContent, TabPane } from "sveltestrap";
  import { BlocksAPI, ProjectsAPI, UsersAPI } from "../../api/admin";
  import { Card, error, Loading, Screen, success } from "../../structure";
  import { processFlow, translateStatus, translateDate, dateToAgo, DATE_FORMAT_LOCALE_SHORT, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_FULL } from "../../utils";

  export let userId = 0;
  export let projectId = 0;

  let loading = true;
  let submissionsLoading = true;
  let user: any = null;
  let project: any = null;
  let flow: any = {};
  let submissions: any[] = [];
  let selectedBlock = null;
  let selectedSubmission = null;
  let showSubmissionsModal = false;
  let showDeleteSubmissionModal = false;
  
  onMount(() => {
    setup();
  });

  const setup = async () => {
    loading = true;
    try{
      const userResult = await UsersAPI.getUser(userId);
      const u = userResult.body.data;
      if(u.participantCode === ""){
        u.display = `${u.title} ${u.firstName} ${u.lastName}`
      } else {
        u.display = `Participant ${u.participantCode}`
      }
      user = u;

      const projectResult = await ProjectsAPI.getProject(projectId);
      project = projectResult.body.data;

      const flowResult = await UsersAPI.getUserProject(userId, projectId);
      flow = processFlow(flowResult.body.data, true);
    }catch(err){

    }finally{
      loading = false;
    }
  }

  const selectBlock = (block: any) => {
    selectedBlock = block;
    if(block.blockType === "form"){
      getBlockSubmissions(block);
    }
  }

  const getBlockSubmissions = async (block: any) => {
    submissionsLoading = true;
    try{
      showSubmissionsModal = true; // we do this here to show a spinner
      const result = await BlocksAPI.getSubmissionsForUser(projectId, block.moduleId, block.blockId, userId);
      const subs: any[] = []; // we need the module id for the delete path
      result.body.data.forEach((s) => {
        s.moduleId = block.moduleId;
        subs.push(s);
      })
      subs.sort((a, b) => {
        return a.submittedOn < b.submittedOn ? 1 : -1;
      })
      submissions = subs;
      submissionsLoading = false;
    }catch(err){
      showSubmissionsModal = false;
      submissionsLoading = false;
      error("Uh Oh", "We could not load that submission");
    } finally {

    }
  }

  const deleteSubmission = async () => {
    submissionsLoading = true;
    try{
      await BlocksAPI.deleteSubmissionForUser(projectId, selectedSubmission.moduleId, selectedSubmission.blockId, userId, selectedSubmission.id);
      success("Deleted!", "We have deleted that submission.");
      if(submissions.length === 1) { // that was the last one, so pull the whole thing again
        const newFlow: any[] = [];
        flow.forEach((f) => {
          if(f.moduleId === selectedBlock.moduleId){
            f.status = "started";
            f.blocks.forEach((b, i, a) => {
              if(b.blockId === selectedBlock.id){
                a[i].userStatus = "not_started";
              }
            })
          }

          newFlow.push(f);
        })
        flow = newFlow;
      }
      showDeleteSubmissionModal = false;
      showSubmissionsModal = false;
    }catch(err){
      error("Uh oh!", "We could not delete that submission.");
    }finally {
      submissionsLoading = false;
    }
  }

  const selectSubmission = (submission: any) => {
    selectedSubmission = submission;
    showDeleteSubmissionModal = true;
  }

  const toggleSubmissionsViewModal = () => {
    showSubmissionsModal = !showSubmissionsModal;
  }

  const toggleSubmissionDeleteModal = () => {
    showDeleteSubmissionModal = !showDeleteSubmissionModal;
  }

</script>

<Screen {loading}>
  <div class="row">
    <div class="col-12">
      <Card title={`${project.name} - ${user.display}`} {loading}>
        {#each flow as m, i}
          <h1>Module {i+1}: {m.name} - {translateStatus(m.status)}</h1>
          {#each m.blocks as block, blockOrder}
            <div class="row">
              <div class="col-3 offset-1">
                {blockOrder+1}: {block.blockName}
              </div>
              <div class="col-2">
                <span class={"text-status text-status-" + block.userStatus}>{translateStatus(block.userStatus)}</span>
              </div>
              <div class="col-3">
                Last Updated: {translateDate(block.lastUpdatedOn)}
              </div>
              <div class="col-2">
                {dateToAgo(block.lastUpdatedOn)}
              </div>
              {#if block.blockType === "form"}
                <div class="col-1">
                  <Icon name="eye" class="text-primary text-link" onclick={() => selectBlock(block)} />
                </div>
              {/if}
            </div>
          {/each}
        {/each}
      </Card>
    </div>
  </div>

  <Modal isOpen={showSubmissionsModal} toggle={toggleSubmissionsViewModal} size="xl">
    <ModalHeader toggle={toggleSubmissionsViewModal}>{`Submissions for: ${selectedBlock.blockName}`}</ModalHeader>
    <ModalBody>
      {#if submissionsLoading}
        <div class="row">
          <div class="col-12 text-center">
            <Loading />
          </div>
        </div>
      {:else}
        {#if submissions.length === 1}
        <div class="row">
          <div class="col-12">
            Responses submitted on {translateDate(submissions[0].submittedOn, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT)}
          </div>
        </div>
          {#each submissions[0].responses as resp}
            <div class="row">
              <div class="col-4">
                {resp.questionText}
              </div>
              <div class="col-8">
                {resp.textResponse}
              </div>
            </div>
            <div class="row">
              <div class="col-10 offset-1">
                <button class="btn btn-block btn-danger" on:click={() => selectSubmission(submissions[0])}>Delete Submission</button>
              </div>
            </div>
          {/each}
        {:else}
          <TabContent>
            {#each submissions as sub, i}
              <TabPane tabId={i} tab={translateDate(sub.submittedOn, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT)} active={i===0}>
                {#each sub.responses as resp}
                  <div class="row">
                    <div class="col-4 offset-1">
                      {resp.questionText}
                    </div>
                    <div class="col-7">
                      {resp.textResponse}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-10 offset-1">
                      <button class="btn btn-block btn-danger" on:click={() => selectSubmission(sub)}>Delete Submission</button>
                    </div>
                  </div>
                {/each}
              </TabPane>
            {/each}
          </TabContent>
        {/if}
      {/if}
    </ModalBody>
  </Modal>


  <Modal isOpen={showDeleteSubmissionModal} toggle={toggleSubmissionDeleteModal} size="md">
    <ModalHeader toggle={toggleSubmissionDeleteModal}>Delete Submission</ModalHeader>
    <ModalBody>
      <strong class="text-danger">Warning:</strong> You are trying to delete the submission from {translateDate(selectedSubmission.submittedOn, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_FULL)}. This cannot be undone. If this removes all submissions for the user, the module status will be set back to Not Started.
    </ModalBody>
    <ModalFooter>
      <button class="btn btn-block btn-danger" on:click={deleteSubmission}>Yes, Delete My Responses</button>
    </ModalFooter>
  </Modal>
</Screen>