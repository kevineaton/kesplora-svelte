<script lang="ts">
  import { Link, navigate } from "svelte-routing";
  import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Modal, ModalBody, ModalFooter, ModalHeader, Nav, Navbar, NavbarBrand, NavItem } from "sveltestrap";
  import { UsersAPI } from "../api";
  import { menuOpenStore, siteStore, userStore } from "../stores";
  import NoteForm from "./NoteForm.svelte";

  let logoutLoading = false;
  let showNoteModal = false;

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

  const toggleNewNoteModal = () => {
    showNoteModal = !showNoteModal;
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
      <Dropdown nav inNavbar>
        <DropdownToggle nav caret>Notes</DropdownToggle>
        <DropdownMenu end color="dark" dark>
          <DropdownItem><button class="btn btn-link nav-link" on:click={toggleNewNoteModal}>Create Journal Entry</button></DropdownItem>
          <DropdownItem><Link to="/notes" class="nav-link">My Notes</Link></DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <NavItem>
        <button class="btn btn-link nav-link" on:click={logout}>Logout</button>
      </NavItem>
    {:else}
      <NavItem>
        <Link to="/login" class="nav-link">Login</Link>
      </NavItem>
    {/if}
  </Nav>
  
  <Modal isOpen={showNoteModal} toggle={toggleNewNoteModal} size="lg">
    <ModalHeader toggle={toggleNewNoteModal}>Create New Journal Note</ModalHeader>
    <ModalBody>
      <NoteForm onSave={toggleNewNoteModal} />
    </ModalBody>
  </Modal>
</Navbar>