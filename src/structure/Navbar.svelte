<script lang="ts">
  import { Navbar } from "sveltestrap";
  import { menuOpenStore, siteStore } from "../stores";

  const toggleMenu = () => {
    menuOpenStore.set(true);
  }
</script>

<Navbar color="dark" dark={true} class="mb-2">
  <button class="btn btn-link navbar-brand" on:click={toggleMenu}>{$siteStore ? $siteStore.name : "Kesplora"}</button>
</Navbar>