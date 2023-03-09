<script lang="ts">
    import { onMount } from "svelte";
    import { Icon } from "sveltestrap";
    import Loading from "../../../structure/Loading.svelte";
    import BlockFormQuestionOption from "./BlockFormQuestionOption.svelte";


  let loading = true;
  export let index = 0;
  export let question = null;
  export let formType: "quiz" | "survey" = "survey";

  const onEdit = (e: any) => {
    question[e.target.id] = e.target.value;
    console.log(question);
  }

  onMount(() => {
    if(!question){
      question = {
        id: 0,
        questionType: "multiple",
        question: "",
        formOrder: "9999",
        options: [],
      }
    }
    loading = false;
  })

  const addOption = () => {
    question.options.push({
      id: 0,
      optionText: "",
      optionOrder: question.options.length,
      optionIsCorrect: "na",
    });
    question = question;
  }

  const updateOption = (optionToUpdate: any) => {
    console.log("updating");
    console.log(optionToUpdate);
    for(let option of question.options){
      if(optionToUpdate.id === option.id){
        option = optionToUpdate;
      }
    }
    question = question;
    console.log(question.options);
  }

  const moveOption = (index: number, direction: "up" | "down") => {
    console.log(`Moving index ${index} ${direction}`)
    let options: any[] = [];
    for(let i = 0; i < question.options.length; i++){
      // TODO:
    }
  }

  const deleteOption = (index: number) => {
    const options: any[] = [];
    for(let i = 0; i < question.options.length; i++){
      if(i !== index){
        options.push(question.options[i]);
      }
    }
    question.options = options;
  }
</script>

{#if loading}
  <Loading />
{:else}
<div class="row">
  <div class="col-3">
    <label for="questionType">Question Type</label>
    <select id="questionType" class="form-control" value={question.questionType} on:change={onEdit}>
      <option value="explanation">Explanation (No Input)</option>
      <option value="likert5">5 Point Likert</option>
      <option value="likert7">7 Point Likert</option>
      <option value="single">Single</option>
      <option value="multiple">Multiple</option>
      <option value="short">Short</option>
      <option value="long">Long</option>
    </select>
  </div>
  <div class={question.questionType === "explanation" ? "col-9" : "col-3"}>
    <label for="question">Question</label>
    <input type="text" id="question" class="form-control" value={question.question} on:change={onEdit} />
  </div>
  {#if question.questionType === "multiple" || question.questionType === "single"}
    <div class="col-6">
      <label for="options">Options</label>
      <Icon name="plus-lg" onclick={addOption} class="text-success" style="font-weight:bold; margin-left: 10px;" />
      {#each question.options as option, index}
        <BlockFormQuestionOption 
          formType={formType} 
          questionId={question.id} 
          option={option} 
          index={index} 
          onMoveOption={moveOption}
          onUpdateOption={updateOption} 
          onDeleteOption={deleteOption} />
      {/each}
    </div>
  {/if}
</div>
{/if}