<script lang="ts">
  import Screen from "../structure/Screen.svelte";
  import { userStore } from "../stores/users";
  import { SiteAPI, UsersAPI } from "../api";
    import Card from "../structure/Card.svelte";
    import { navigate } from "svelte-routing";
    import { error } from "../structure";


  let email: string = "";
  let password: string = "";

  const login = async () => {
    try{
      const loginResult = await UsersAPI.login(email, password);
      userStore.set(loginResult.body.data);
      window.localStorage.setItem("user", JSON.stringify(loginResult.body.data));
      navigate("/", {replace: true });
    }catch(err){
      console.log(err);
      error("Uh Oh!", "Could not login. Check your information and try again.");
    }
  }
</script>

<main>
  <Screen>
    <div class="row">
      <div class="col-3 offset-2">
        <Card title="Welcome!">
          <p>Use this form to login to your account with this platform. Your information will depend on whether your access was controlled through a participation code or through an email.</p>
        </Card>
      </div>
      <div class="col-4">
        <Card title="Login">
          <input bind:value={email} type="email" class="form-control" placeholder="Email or Participation Code" />
          <input bind:value={password} type="password" class="form-control" placeholder="Password" />
          <button class="btn btn-block btn-primary" on:click|preventDefault={login}>Login</button>
        </Card>
      </div>
    </div>
  </Screen>

</main>

<style>
</style>