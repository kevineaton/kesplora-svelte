<script lang="ts">
  import { Icon, Modal, ModalBody, ModalFooter, ModalHeader } from "sveltestrap";
  
  export let formType: "survey" | "quiz" = "survey";
  export let questionId = 0;
  export let index = 0;
  export let onUpdateOption: any = () => {};
  export let onDeleteOption: any = (index: number) => {};
  export let onMoveOption: any = (index: number, direction: "up" | "down") => {};
  export let option = null;
  if(!option || !option.optionText){
    option = {
      id: 0,
      questionId: questionId,
      optionText: "",
      optionOrder: index,
      optionIsCorrect: "na"
    };
  }

  let showDeleteModal = false;

  const onEdit = (e: any) => {
    option[e.target.id] = e.target.value;
    option = option;
    console.log("in option")
    onUpdateOption(option);
    console.log("here")
  }

  const toggleDeleteModal = () => {
    showDeleteModal = !showDeleteModal;
  }

  const handleDeleteOption = () => {
    onDeleteOption(index)
  }
</script>

<div class="row">
  <div class="col-1">
    {#if index !== 0}
      <Icon name="arrow-up" onclick={() => onMoveOption(index, "up")}  />
    {/if}
  </div>
  <div class="col-1">
    <Icon name="arrow-down" onclick={() => onMoveOption(index, "down")} />
  </div>
  <div class="col-8">
    <input type="text" class="form-control" id="optionText" bind:value={option.optionText} on:input={onEdit} />
  </div>
    {#if formType === "quiz"}
      <div class="col-2">
        <select class="form-control" id="optionIsCorrect" bind:value={option.optionIsCorrect} on:input={onEdit}>
          <option value="na">N/A</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    {/if}
  <div class="col-2">
    <Icon name="x-lg" class="text-danger" onclick={toggleDeleteModal} />
  </div>
</div>

<Modal isOpen={showDeleteModal} toggle={toggleDeleteModal}>
  <ModalHeader toggle={toggleDeleteModal}>Delete Block</ModalHeader>
  <ModalBody>
    <strong class="text-danger">Warning: </strong> You are about to delete this option. This cannot be undone.
  </ModalBody>
  <ModalFooter>
    <button class="btn btn-block btn-danger" on:click={handleDeleteOption}>I Confirm</button>
  </ModalFooter>
</Modal>