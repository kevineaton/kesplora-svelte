<script lang="ts">
  import { Link } from "svelte-routing";
  import { Nav, Navbar, NavbarBrand, NavItem } from "sveltestrap";
  import { menuOpenStore, siteStore, userStore } from "../stores";

  // if the user is not logged in, all we want to show is the login button
  
  // if the user is logged in, if they are an admin, we show the admin options

  // otherwise, just show logout
  console.log($userStore)

  const toggleMenu = () => {
    if($userStore){

    }
    menuOpenStore.set(true);
  }
</script>

<Navbar color="dark" dark={true} class="mb-2">
  <NavbarBrand href="/">{$siteStore ? $siteStore.name : "Kesplora"}</NavbarBrand>
  <Nav>
    {#if $userStore}
      <NavItem>
        <Link to="/profile" class="nav-link">Profile</Link>
      </NavItem>
      {#if $userStore.systemRole === "admin"}
        <NavItem>
          <button class="btn btn-link nav-link" on:click={toggleMenu}>Admin</button>
        </NavItem>
      {/if}
      <NavItem>
        <button class="btn btn-link nav-link">Logout</button>
      </NavItem>
    {:else}
      <NavItem>
        <Link to="/login" class="nav-link">Login</Link>
      </NavItem>
    {/if}
  </Nav>
</Navbar>