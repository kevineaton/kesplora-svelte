<script lang="ts">
  import { MarkdownEditor } from "../structure";
  import { siteStore } from "../stores";

  let site = null;
  siteStore.subscribe(s => {
    site = s;
  })

  const name = site && site.name ? site.name : "Welcome!";
  const data = site && site.description ? site.description : "";

  // TODO: get the projects list based upon preferences
</script>

<h1>{name}</h1>
<MarkdownEditor content={data} mode="view" />