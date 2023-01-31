<script lang="ts">
  import { MarkdownEditor } from "../structure";
  import { siteStore, userStore } from "../stores";
  import { onMount } from "svelte";
  import { SiteAPI } from "../api";
    import { Link } from "svelte-routing";
  
  let projects: any[] = [];

  const name = $siteStore && $siteStore.name ? $siteStore.name : "Welcome!";
  const data = $siteStore && $siteStore.description ? $siteStore.description : "";

  // TODO: get the projects list based upon preferences


  onMount(async () => {
    const projectsResult = await SiteAPI.getSiteProjects();
    projects = projectsResult.body.data;
  });

  // note that the list of projects will differ significantly based upon
  // the user's role

  // TODO: if the user is logged in and not an admin, we need to get the 
  // projects they are already enrolled in for the status
</script>

<h1>{name}</h1>
<MarkdownEditor content={data} mode="view" />

{#if projects.length === 0}
  <strong>There are no active public projects for this site yet.</strong>
{:else}
  {#each projects as project (project.id)}
    <h2>Available Projects</h2>
    <div class="project-list-item">
      <div class="row">
        <div class="col-12">
          <Link to={$userStore && $userStore.systemRole === "admin" ? `/admin/projects/${project.id}` : `/participant/projects/${project.id}`}>{project.name}</Link>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          {project.shortDescription}
        </div>
      </div>
    </div>
  {/each}
{/if}