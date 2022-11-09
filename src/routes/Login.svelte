<script lang="ts">
  import Screen from "../structure/Screen.svelte";
  import { userStore } from "../stores/users";
    import { SiteAPI, UsersAPI } from "../api";

  let foundUser = null;
  userStore.subscribe(u => {
    foundUser = u
  });
  console.log(foundUser);

  let email: string = "";
  let password: string = "";

  const login = async () => {
    console.log(email);
    console.log(password);
    try{

      const result = await SiteAPI.getSiteSetupInfo()
    console.log(result);
    }catch(err){
      console.log(err);
    }
  }
</script>

<main>
  <Screen>
    <h1>Login</h1>
  
    <div class="card">
      <input bind:value={email} type="email" class="form-control" placeholder="Email" />
      <input bind:value={password} type="password" class="form-control" placeholder="Password" />
      <button class="btn btn-block btn-primary" on:click={login}>Login</button>
    </div>
  </Screen>

</main>

<style>
</style>