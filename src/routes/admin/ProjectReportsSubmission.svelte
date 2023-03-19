<script type="ts">
  import { onMount } from "svelte";

  import { Screen, Card } from "../../structure";
  import { ReportsAPI } from "../../api/admin";
  import { Likert, ShortLong, SingleMultiple } from "./ProjectReportsSubmissionCharts";

  export let projectId = 0;
  export let moduleId = 0;
  export let blockId = 0;

  let loading = true;
  let report = null;

  onMount(async () => {
    setup();
  })

  const setup = async () => {
    loading = true;
    try{
      const results = await ReportsAPI.getProjectSubmissionsForBlock(projectId, moduleId, blockId);
      report = results.body.data;
    }catch(err){
      console.log(err);
    }finally{
      loading = false;
    }
  }
</script>

<Screen>
  <div class="row">
    <div class="col-12">
      <Card {loading} title={report && report.blockName ? report.blockName : "Loading..."}>
        <div class="row">
          {#each report.questions as question}
          <div class="col-6">
              {#if question.questionType === "single" || question.questionType === "multiple"}
                <SingleMultiple data={question} />
              {:else if question.questionType === "short" || question.questionType === "long"}
                <ShortLong data={question} type={question.questionType} />
              {:else if question.questionType === "likert5" || question.questionType === "likert7"}
                <Likert data={question} likertCount={question.questionType === "likert5" ? 5 : 7} />
              {/if}
            </div>
          {/each}
        </div>
      </Card>
    </div>
  </div>
</Screen>