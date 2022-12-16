<script lange="ts">
  import { Router, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { SiteAPI } from "./api";
  import { isSetupStore, siteStore } from "./stores";
  import { error, Loading, Menu, Navbar } from "./structure";

  // routes
  import {
    Blocks,
    Home,
    Login,
    Modules,
    ModuleBlocks,
    Projects,
    ProjectFlowEditor,
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
          // we don't have the site in localstorage, so we need to get it
          const siteResult = await SiteAPI.getSiteInfo();
          siteStore.set(siteResult.body.data);
          localStorage.setItem("site", JSON.stringify(siteResult.body.data));

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
  <div class="row">
    <div class="col-10 offset-1">
      <div class="row">
        <div class="col-12">
          <Router>
            <Menu isOpen={true} />
            <Navbar />
            {#if loading}
              <div style="text-align: center; height: 100%; margin-top: 10%">
                <Loading />
              </div>
            {:else}
              <Route path="/" component={Home} />
              <Route path="/setup" component={Setup} />
              <Route path="/login" component={Login} />
              <Route path="/admin/projects" component={Projects} />
              <Route path="/admin/projects/:projectId/flow" component={ProjectFlowEditor} />
              <Route path="/admin/modules" component={Modules} />
              <Route path="/admin/modules/:moduleId/blocks" component={ModuleBlocks} let:params />
              <Route path="/admin/blocks" component={Blocks} />
            {/if}
            
          </Router>
        </div>
      </div>
    </div>
  </div>
</div>