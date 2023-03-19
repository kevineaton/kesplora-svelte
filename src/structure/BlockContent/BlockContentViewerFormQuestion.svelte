<script lang="ts">
  export let question: any;
  export let onChange: any = () => {};

  const handleChange = (e: any) => {
    onChange({ questionId: question.id, questionType: question.questionType, response: e.target.value });
  }

</script>
<div class="row">
  <div class={question.questionType === "explanation" ? "col-12" : "col-4"}>
    {question.question}
  </div>
  <div class={question.questionType === "explanation" ? "" : "col-4"}>
    {#if question.questionType === "single"}
    <select class="form-control" on:change={handleChange}>
        <option value={null} disabled={true} selected={true}>Select...</option>
      {#each question.options as option}
        <option value={option.id}>{option.optionText}</option>
      {/each}
    </select>
    {:else if question.questionType === "multiple"}
      {#each question.options as option}
        <div class="form-group">
          <input type="checkbox" class="form-check-input" value={option.id}  on:change={handleChange}/> <label class="form-check-label" for={option.id}> {option.optionText}</label>
        </div>
      {/each}
    {:else if question.questionType === "short"}
      <input type="text" class="form-control"  on:keyup={handleChange}/>
    {:else if question.questionType === "long"}
      <textarea class="form-control" rows={4}  on:keyup={handleChange}/>
    {:else if question.questionType === "likert5"}
      <select class="form-control" on:change={handleChange}>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>
    {:else if question.questionType === "likert7"}
    <select class="form-control" on:change={handleChange}>
      <option value={1}>1</option>
      <option value={2}>2</option>
      <option value={3}>3</option>
      <option value={4}>4</option>
      <option value={5}>5</option>
      <option value={6}>6</option>
      <option value={7}>7</option>
    </select>
    {/if}
  </div>
</div>