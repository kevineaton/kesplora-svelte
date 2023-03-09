<script lang="ts">
  import { MarkdownEditor } from "../structure";
  import { siteStore, userStore } from "../stores";
  import { onMount } from "svelte";
  import { SiteAPI } from "../api";
  import { Link } from "svelte-routing";
  import { ProjectsAPI } from "../api/participant";
  import { Card, Screen } from "../structure";
  
  let loading = true;
  let siteProjects: any[] = [];
  let userProjects: any[] = [];

  const name = $siteStore && $siteStore.name ? $siteStore.name : "Welcome!";
  const data = $siteStore && $siteStore.description ? $siteStore.description : "";

  // TODO: get the projects list based upon preferences
  console.log($userStore)


  onMount(async () => {
    loading = true;
    try{
      const siteProjectsResult = await SiteAPI.getSiteProjects();
      if($userStore && $userStore.systemRole !== "admin"){
        const userProjectsResult = await ProjectsAPI.getProjects();
        userProjects = userProjectsResult.body.data;
        // if it's in the user projects, we remove it from site projects
        // since this is a small list, a loop in a loop is fine
        for(const sp of siteProjectsResult.body.data){
          let foundSpInUp = false;
          for(const up of userProjects){
            if(up.id === sp.id){
              foundSpInUp = true;
              break;
            }
          }
          if(!foundSpInUp){
            siteProjects.push(sp);
          }
        }
      } else {
        siteProjects = siteProjectsResult.body.data;
      }
      
    }catch(err){
      console.log(err);
    }finally {
      loading = false;
    }
  });

</script>

<Screen {loading}>
  <h1>{name}</h1>
  <MarkdownEditor content={data} mode="view" />
  {#if $userStore && $userStore.systemRole !== "admin"}
    <div class="row">
      <div class="col-6">
        <h2>My Projects</h2>
        {#if userProjects.length === 0}
          <strong>You have not enrolled in any active projects.</strong>
        {:else}
          {#each userProjects as project (project.id)}
          <Card title={project.name}>
            <div class="row">
              <div class="col-12">
                <MarkdownEditor content={project.shortDescription} mode="view" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <Link to={`/participant/projects/${project.id}/flow`}>{project.name}</Link>
              </div>
            </div>
          </Card>
          {/each}
        {/if}
      </div>
      <div class="col-6">
        <h2>Available Projects</h2>
        {#if siteProjects.length === 0}
          <strong>There are no active public projects for this site.</strong>
        {:else}
          {#each siteProjects as project (project.id)}
            <Card title={project.name}>
              <div class="row">
                <div class="col-12">
                  <MarkdownEditor content={project.shortDescription} mode="view" />
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <Link to={`/participant/projects/${project.id}`}>{project.name}</Link>
                </div>
              </div>
            </Card>
          {/each}
        {/if}
      </div>
    </div>
  {:else}
    <div class="row">
      <div class="col-6">
        <h2>Projects</h2>
        {#if siteProjects.length === 0}
          <strong>You have not enrolled in any active projects.</strong>
        {:else}
          {#each siteProjects as project (project.id)}
          <Card title={project.name}>
            <div class="row">
              <div class="col-12">
                <MarkdownEditor content={project.shortDescription} mode="view" />
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <Link to={`${$userStore && $userStore.systemRole === "admin" ? "/admin/" : "/participant/"}projects/${project.id}`}>{project.name}</Link>
              </div>
            </div>
          </Card>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
  
</Screen>