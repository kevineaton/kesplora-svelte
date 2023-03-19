<script lang="ts">
  import { onMount } from "svelte";
  import Chart from "svelte-frappe-charts";
  import { Card } from "../../../structure";

  export let data = null;

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
    data.responses.forEach((response) => {
      labels.push(response.textResponse);
      vals.push(response.count);
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