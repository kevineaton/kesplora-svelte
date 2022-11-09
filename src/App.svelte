<script>
  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import { SiteAPI } from "./api";

  // routes
  import {
    Login,
    Setup
  } from "./routes/index";
  
  // check the user login to determine where they should go
  import { isSetupStore, userStore } from "./stores";

  let isSetup = false;
  isSetupStore.subscribe(is => {
    isSetup = is;
  })

  let user = null;
  userStore.subscribe(u => {
    user = u
  });

  onMount(async () => {
    // if the site is already set up, we can skip the check
    console.log(isSetup);
    console.log(user);
    if(!isSetup){
      try{
        const result = await SiteAPI.getSiteSetupInfo();
        console.log(result.body);
        if(result.body.data.configured){
          isSetupStore.set(true);
        } else {
          navigate("/setup", {replace: true});
        }

      }catch(err){
        console.log(err);
        navigate("/setup", {replace: true});
      }
    } else {
      // site is setup, so let's check if they are logged in
    }
  })
  

</script>

<Router>

  <Route path="/" />
  <Route path="/setup" component={Setup} />
  <Route path="/login" component={Login} />
  
</Router>