<script type="ts">
  import { onMount } from "svelte";
  import { SiteAPI } from "../../api/admin";
  import { Card, error, MarkdownEditor, Screen, success } from "../../structure";
  import { siteStore } from "../../stores";

  let loading = true;
  let site: any = null;

  onMount(async () => {
    loading = true;
    try {
      const result = await SiteAPI.getSiteInfo();
      site = result.body.data;
      loading = false;
    } catch (err) {
      console.log(err);
    }
  });

  const updateSite = async () => {
    loading = true;
    try {
      const result = await SiteAPI.updateSiteInfo(site);
      site = result.body.data;
      loading = false;

      siteStore.set(site);
      localStorage.setItem("site", JSON.stringify(site));
      success("Saved!", "We have saved the site's information. Users may need to log out and back in to see the changes.")
    } catch (err) {
      error("Uh oh!", "We could not save those changes.");
    }
  }
</script>

<Screen>
  <Card {loading} title="Site Information">
    <div class="row">
      <div class="col-4">
        <div class="row">
          <div class="col-12">
            <label for="name">Site Name</label>
            <input
              type="text"
              id="name"
              bind:value={site.name}
              class="form-control"
            />
            <span class="form-control-description">The name of the site or organization.</span>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <label for="shortName">Short Name</label>
            <input
              type="text"
              id="shortName"
              bind:value={site.shortName}
              class="form-control"
            />
            <span class="form-control-description">A short name for the organization, without spaces. Used for
              organizing assets.</span>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <label for="domain">Domain</label>
            <input
              type="text"
              id="domain"
              bind:value={site.domain}
              class="form-control"
            />
            <span class="form-control-description">The domain for this site.</span>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <label for="siteTechnicalContact">Technical Contact</label>
            <input
              type="text"
              id="siteTechnicalContact"
              bind:value={site.siteTechnicalContact}
              class="form-control"
            />
            <span class="form-control-description">The email address or contact information for users who need
              technical support.</span>
          </div>
        </div>
      </div>

      <div class="col-8">
        <div class="row">
          <div class="col-12">
            <label for="code">Description</label>
            <span class="form-control-description">The site's description, in Markdown. This will be displayed on
              the homepage of the site.</span>
            <MarkdownEditor bind:content={site.description} mode="edit" />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <button class="btn btn-block btn-primary" on:click={updateSite}>Save Site Settings</button>
        </div>
      </div>
    </div>
  </Card>
</Screen>
