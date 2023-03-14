<script type="ts">

  // here the user can change their profile; however, if they are linked with a
  // participant code, we don't let them give too much identifying information!

  import { Card, DatePicker, error, Screen, success } from "../structure";
  import { UsersAPI } from "../api";
  import { onMount } from "svelte";
  import { DateTime } from "luxon";

  let loading = true;
  let user = null;

  onMount(async () => {
    loading = true;
    try{
      const result = await UsersAPI.getMe();
      const userRaw = result.body.data;
      userRaw.password = "";
      const dateOfBirth = DateTime.fromISO(userRaw.dateOfBirth).toJSDate();
      userRaw.dateOfBirth = dateOfBirth;
      user = userRaw;
    }catch(err){
      console.log(err);
    } finally {
      loading = false;
    }
  })

  const saveProfile = async () => {
    const data = {
      ...user,
      dateOfBirth: DateTime.fromJSDate(user.dateOfBirth).toISODate(),
    }
    loading = true;
    try{ 
      await UsersAPI.updateMe(data);
      success("Saved!", "Your profile has been updated!");
      user.password = "";
      user = user;
    }catch(err){
      error("Ug oh!", "We could not save your profile");
    }finally{
      loading = false;
    }
  }
</script>

<Screen>
  <div class="row">
    <div class="col-4 offset-4">
      <Card title="My Profile" { loading }>
        {#if user.participantCode === ""}

          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" class="form-control" id="title" bind:value={user.title} />
          </div>
          
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" class="form-control" id="firstName" bind:value={user.firstName} />
          </div>
          
          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" class="form-control" id="lastName" bind:value={user.lastName} />
          </div>
          
          <div class="form-group">
            <label for="pronouns">Pronouns</label>
            <input type="text" class="form-control" id="pronouns" bind:value={user.pronouns} />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="text" class="form-control" id="email" bind:value={user.email} />
          </div>
        {:else}
          <div class="form-group">
            <p>This account was created to anonymously participate in a project. Therefore, you cannot change your identifiable information.</p>
          </div>
          <div class="form-group">
            <label for="participantCode">Participant Code</label>
            <input type="participantCode" class="form-control" id="participantCode" disabled={true} bind:value={user.participantCode} />
          </div>
        {/if}
        
        <div class="form-group">
          <label for="password">New Password</label>
          <input type="text" class="form-control" id="password" bind:value={user.password} />
        </div>
        
        <div class="form-group">
          <label for="dob">Date of Birth</label>
          <DatePicker id="dob" bind:value={user.dateOfBirth}  />
        </div>
            
        <div class="form-group">
          <button class="btn btn-block btn-primary" on:click={saveProfile}>Save</button>
        </div>
      </Card>
    </div>
  </div>
</Screen>