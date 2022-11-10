<script lange="ts">
  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { SiteAPI } from "./api";
  import { isSetupStore, siteStore } from "./stores";
  import { error, Loading, Menu, Navbar } from "./structure";

  // routes
  import {
    Home,
    Login,
    Setup
  } from "./routes/index";
  
  // // check the site status
  let loading = true;

  // this can be cleaned up once we get the architecture sorted
  onMount(async () => {
    // if the site is already set up, we can skip the check
    if(!$isSetupStore){
      try{
        const result = await SiteAPI.getSiteSetupInfo();
        if(result.body.data.configured){
          $isSetupStore = true;
          localStorage.setItem("isSetup", "true");
          loading = false;
        } else {
          loading = false;
          navigate("/setup", {replace: true});
        }

      }catch(err){
        loading = false;
        navigate("/setup", {replace: true});
      }
    } else {
      // site is setup, so let's check if we need to fetch the metadata
      if(!$siteStore){
        try{
          const result = await SiteAPI.getSiteInfo();
          siteStore.set(result.body.data);
          localStorage.setItem("site", JSON.stringify(result.body.data));
        }catch(err){
          return error("Error", "Site is configured but unreachable.");
        }
      }
      loading = false;
    }
  })
  

</script>
<div class="app">
  <SvelteToast />
  <Menu isOpen={true} />
  <div class="row">
    <div class="col-10 offset-1">
      <div class="row">
        <div class="col-12">
          <Router>
            <Navbar />
            {#if loading}
              <div style="text-align: center; height: 100%; margin-top: 10%">
                <Loading />
              </div>
            {:else}
              <Route path="/" component={Home} />
              <Route path="/setup" component={Setup} />
              <Route path="/login" component={Login} />
            {/if}
            
          </Router>
        </div>
      </div>
    </div>
  </div>
</div>