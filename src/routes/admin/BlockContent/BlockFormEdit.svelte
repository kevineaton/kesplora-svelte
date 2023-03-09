<script lang="ts">
  // for v1, we are only allowing surveys, no quizzes
  import { Icon } from "sveltestrap";
  import BlockFormEditQuestion from "./BlockFormEditQuestion.svelte";

  export let content: any = {};
  if(!content.questions){
    content.questions = [];
  }
  if(!content.formType){
    content.formType = "survey";
  }
  if(!content.allowResubmit){
    content.allowResubmit = "no";
  }

  const onEdit = (e: any) => {
    content[e.target.id] = e.target.value;
  }

  const addQuestion = () => {
    content.questions.push({
      blockId: 0,
      questionType: "single",
      question: "",
      formOrder: content.questions.length,
      options: [],
    })
    console.log(content.questions);
    content = content;
  }

  const moveQuestion = (index: number, direction: "up" | "down") => {
    console.log(`Moving index ${index} ${direction}`)
    let options: any[] = [];
    for(let i = 0; i < content.questions.length; i++){
      // TODO:
    }
  }
</script>

<div class="block-edit-container">
  <div class="row">
    <div class="col-6">
      <label for="">Form Type</label>
      <select id="formType" class="form-control" value={content.formType} on:change={onEdit}>
        <option value="survey">Survey</option>
        <option value="quiz" disabled={true}>Quiz / Check on Learning</option>
      </select>
    </div>
    <div class="col-6">
      <label for="">Allow Resubmissions</label>
      <select id="allowResubmit" class="form-control" value={content.allowResubmit} on:change={onEdit}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
  </div>
  <hr />
  <div class="row">
    <div class="col-12">
      <strong>Questions</strong>
      <Icon name="plus-lg" onclick={addQuestion} class="text-success" style="font-weight:bold; margin-left: 10px;" />
    </div>
  </div>
  {#each content.questions as question, index}
    <BlockFormEditQuestion question={question} index={index} />
  {/each}
</div>
