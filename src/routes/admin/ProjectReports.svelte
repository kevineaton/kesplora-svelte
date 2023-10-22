<script type="ts">
  import Grid from "gridjs-svelte";
  import { h } from "gridjs";
  import { onMount } from "svelte";
  import Chart from "svelte-frappe-charts";
  import { Link, navigate } from "svelte-routing";
  import { ProjectsAPI, ReportsAPI } from "../../api/admin";
  import { Card, error, Screen } from "../../structure";


  export let projectId = 0;
  let loading = true;
  let project = null;
  let usersByStatus = {labels: [], datasets: [], total: 0};
  let usersByLastUpdated = {labels: [], datasets: []};
  let usersByFlowStatus = {labels: [], datasets: []};
  let submissions: any[] = [];
  

  onMount(async () => {
    setup()
  });

  const setup = async () => {
    loading = true;
    try{
      const pResult = await ProjectsAPI.getProject(projectId);
      const pRaw = pResult.body.data;

      const usersByStatusResult = await ReportsAPI.getUsersOnProjectByStatus(projectId);
      usersByStatus = processStatusToChartData(usersByStatusResult.body.data);
      
      const usersByLastUpdatedOnResult = await ReportsAPI.getUsersOnProjectByLastUpdated(projectId);
      usersByLastUpdated = processLastUpdatedToChartData(usersByLastUpdatedOnResult.body.data);

      const usersByFlowStatusResult = await ReportsAPI.getUsersOnProjectByFlowStatus(projectId);
      usersByFlowStatus = processFlowStatusToChartData(usersByFlowStatusResult.body.data);

      const submissionResult = await ReportsAPI.getProjectSubmissions(projectId);
      submissions = submissionResult.body.data;

      pRaw.totalUsers = usersByStatus.total;
      project = pRaw;

    }catch(err){
      error("Uh oh", "Could not load that data");
    }finally{
      loading = false;
    }
  }

  const refresh = () => {
    setup();
  }

  const selectSubmission = (blockId) => {
    submissions.forEach((sub) => {
      if(sub.blockId === blockId){
        const url = `/admin/projects/${projectId}/flow/modules/${sub.moduleId}/blocks/${sub.blockId}/submissions`;
        return navigate(url);
      }
    })
  }

  const processStatusToChartData = (data: any[]) => {
    const mapping = {
      started: 0,
      not_started: 0,
      completed: 0,
      total: 0
    };
    data.map((entry) => {
      mapping[entry.value] = entry.count;
      mapping.total += entry.count;
    })
    return {
      labels: ["Started", "Not Started", "Completed"],
      datasets: [
        {
          name: "Project Status",
          values: [mapping.started, mapping.not_started, mapping.completed]
        }
      ],
      total: mapping.total, // used for the total user count
    }
  }

  const processLastUpdatedToChartData = (data: any[]) => {
    const mapping = {
      last1: 0,
      last3: 0,
      last7: 0,
      last30: 0,
      older: 0,
      total: 0,
    };
    data.map((entry) => {
      mapping.total++;
      entry.value = parseInt(entry.value);
      if(entry.value <= 1){
        mapping.last1 += entry.count;
      } else if(entry.value <= 3){
        mapping.last3 += entry.count;
      } else if(entry.value <= 7){
        mapping.last7 += entry.count;
      } else if(entry.value <= 30){
        mapping.last30 += entry.count;
      } else {
        mapping.older += entry.count;
      }
    })
    return {
      labels: ["Last Day", "Last 3 Days", "Last 7 Days", "Last 30 Days", "Older than 30 Days"],
      datasets: [
        {
          name: "Last Updated",
          values: [mapping.last1, mapping.last3, mapping.last7, mapping.last30, mapping.older]
        }
      ]
    }
  }

  const processFlowStatusToChartData = (data: any[]) => {
    const labels: any[] = [];
    const notStartedValues: number[] = [];
    const startedValues: number[] = [];
    const completedValues: number[] = [];
    data.map((entry) => {
      labels.push(`${entry.moduleName}: ${entry.blockName}`);
      notStartedValues.push(entry.notStartedCount)
      startedValues.push(entry.startedCount)
      completedValues.push(entry.completedCount)
    });

    return {
      labels,

      datasets: [
        {
          name: "Not Started",
          values: notStartedValues,
        },
        {
          name: "Started",
          values: startedValues,
        },
        {
          name: "Completed",
          values: completedValues,
        },
      ]
    }
  }

  const submissionCols = [
    {
      id: "moduleName",
      label: "Module Name"
    },
    {
      id: "blockName",
      label: "Block Name"
    },
    {
      id: "count",
      label: "Submissions"
    },
    {
      id: "blockId",
      label: "Actions",
      formatter: (cell) => {
        return [
          h("i", {
            "class": "text-primary bi bi-eye icon-table",
            "onClick": () => {
              selectSubmission(cell);
            }
          })
        ]
      }
    },
  ];
  
</script>

<Screen>
  <div class="row">
    <div class="col-12">
      <Card {loading} title="Project Information"> 
        <div class="row">
          <div class="col-4">
            <strong>{project.name}</strong>
          </div>
          <div class="col-4">
            {project.participantCount} total participants
          </div>
          <div class="col-2">
            <button class="btn btn-block btn-primary" on:click={refresh}>Refresh</button>
          </div>
          <div class="col-2">
            <Link to={`/admin/projects/${projectId}/flow`} class="btn btn-block btn-primary">Edit</Link>
          </div>
        </div>
      </Card>
    </div>
  </div>

  <div class="row">
    <div class="col-12">
      <Card {loading} title="Module Status">
        <Chart data={usersByFlowStatus} type="line" />
      </Card>
    </div>
  </div>

  <div class="row">
    <div class="col-3">
      <Card {loading} title="Users by Status">
        <Chart data={usersByStatus} type="pie" />
      </Card>
    </div>
    <div class="col-3">
      <Card {loading} title="Users by Last Updated">
        <Chart data={usersByLastUpdated} type="pie" />
      </Card>
    </div>
    <div class="col-6">
      <Card {loading} title="Submissions">
        <Grid columns={submissionCols} data={submissions} />
      </Card>
    </div>
  </div>
</Screen>