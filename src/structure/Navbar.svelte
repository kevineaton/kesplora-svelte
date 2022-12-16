<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import { Nav, Navbar, NavbarBrand, NavItem } from "sveltestrap";
    import { UsersAPI } from "../api";
  import { menuOpenStore, siteStore, userStore } from "../stores";

  let logoutLoading = false;

  const logout = async () => {
    try{
      logoutLoading = true;
      await UsersAPI.logout();
      window.localStorage.clear();
      $userStore = null;
      navigate("/", {replace: true});
    }catch(err){
      // this would be very weird...
    } finally{
      logoutLoading = false;
    }    
  }

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
        <button class="btn btn-link nav-link" on:click={logout}>Logout</button>
      </NavItem>
    {:else}
      <NavItem>
        <Link to="/login" class="nav-link">Login</Link>
      </NavItem>
    {/if}
  </Nav>
</Navbar>