<script type="ts">
  import { onMount } from "svelte";
  import { DateTime } from "luxon";
  import { Card, Screen } from "../../structure";
  import { UsersAPI } from "../../api/admin";
    import { Link } from "svelte-routing";
    import { DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_DATE, DATE_FORMAT_LOCALE_SHORT, translateDate } from "../../utils";

  export let userId = 0;

  let loading = true;
  let user = null;
  let projects: any[] = [];
  
  onMount(async () => {
    loading = true;
    try{
      const userResult = await UsersAPI.getUser(userId);
      const projectResult = await UsersAPI.getUserProjects(userId);

      const userRaw = userResult.body.data;
      userRaw.dateOfBirth = userRaw.dateOfBirth === "1970-01-01" ? "Unknown" : translateDate(userRaw.dateOfBirth, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_DATE);
      userRaw.lastLoginOn = translateDate(userRaw.lastLoginOn, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT);
      userRaw.createdOn =  translateDate(userRaw.createdOn, DATE_FORMAT_ISO, DATE_FORMAT_LOCALE_SHORT);
      
      user = userRaw;

      const projectsRaw: any[] = [];
      for(const p of projectResult.body.data){
        p.participantStatus = p.participantStatus === "not_started" ? "Not Started" : p.participantStatus === "started" ? "Started" : "Completed";
        projectsRaw.push(p);
      }
      projects = projectsRaw;

    }catch(err){
      console.log(err);
    }finally{
      loading = false;
    }
  });
</script>

<Screen>
  <div class="row">
    <div class="col-4 offset-1">
      <Card title="User Information" {loading}>
        {#if user.participantCode === ""}
          <div class="row">
            <div class="col-12">
              {user.title} {user.firstName} {user.lastName}
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              Pronouns: {user.pronouns === "" ? "Not Specified" : user.pronouns}
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              <a href="mailto:{user.email}">{user.email}</a>
            </div>
          </div>
        {:else}
          <div class="row">
            <div class="col-12">
              User was created in connection with an anonymous project so limited demographic data is available.
            </div>
          </div>
          <div class="row">
            <div class="col-12">
              Participant Code: {user.participantCode}
            </div>
          </div>
        {/if}
        <div class="row">
          <div class="col-12">
            Date of Birth: {user.dateOfBirth}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            Created: {user.createdOn}
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            Last Login: {user.lastLoginOn}
          </div>
        </div>
      </Card>
    </div>

    <div class="col-6">
      <Card title="User Projects" {loading}>
        {#each projects as project}
          <div class="row">
            <div class="col-1">
              {project.id}
            </div>
            <div class="col-5">
              {project.name}
            </div>
            <div class="col-5">
              {project.participantStatus}
            </div>
            <div class="col-1">
              <Link to={`/admin/users/${userId}/projects/${project.id}`}><i class="text-primary bi bi-eye icon-table" /></Link>
            </div>
          </div>
        {:else}
          <div class="row">
            <div class="col-12">
              <strong>User is not connected to a project.</strong>
            </div>
          </div>
        {/each}
      </Card>
    </div>
  </div>
</Screen>