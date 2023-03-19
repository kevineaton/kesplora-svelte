<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "svelte-frappe-charts";
  import { Card } from "../../../structure";

  export let data = null;
  export let likertCount = 5;

  let loading = true;
  let labels = [];
  let vals = [];

  onMount(() => {
    const parsed = format();
    labels = parsed.labels;
    vals = parsed.vals;
    loading = false;
  })

  const format = () => {
    const labels: any[] = [];
    const vals: any[] = [];
    for(let i = 1; i <= likertCount; i++){
      labels.push(i);
    }
    const mapping = {};
    labels.forEach((l) => {
      mapping[l] = 0;
    })
    data.responses.forEach((response) => {
      const val = parseInt(response.textResponse);
      mapping[val]++;
    })
    labels.forEach((l) => {
      vals.push(mapping[l]);
    })
    return {
      labels,
      vals,
    }
  }

</script>

<div class="row">
  <div class="col-12">
    <Card {loading} title={data && data.questionText ? data.questionText : "Loading..."}>
      <div class="row">
        <div class="col-6">
          <Chart data={{
              labels,
              datasets: [
                {
                  name: "",
                  values: vals,
                }
              ]
            }} type="pie" />
        </div>
        <div class="col-6">
          <Chart data={{
              labels,
              datasets: [
                {
                  name: "",
                  values: vals,
                }
              ]
            }} type="bar" />

        </div>
      </div>
    </Card>
  </div>
</div>