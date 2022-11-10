<script lang="ts">
  import { MarkdownEditor } from "../structure";
  import { siteStore } from "../stores";

  let site = null;
  siteStore.subscribe(s => {
    site = s;
  })

  console.log(site);
  const name = site && site.name ? site.name : "Welcome!";
  const data = site && site.description ? site.description : "";
</script>

<h1>{name}</h1>
<MarkdownEditor content={data} mode="view" />