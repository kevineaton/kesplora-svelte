<script lang="ts">
  import { Link } from "svelte-routing";
  import { Icon, Offcanvas } from "sveltestrap";
  import { menuOpenStore, siteStore, userStore } from "../stores";

  export let isOpen = false;
  menuOpenStore.subscribe(newIsOpen => {
    isOpen = newIsOpen;
  })
  const toggle = () => { 
    isOpen = !isOpen;
    menuOpenStore.set(isOpen); 
  };
  if(!$siteStore){
    $siteStore = {name: "Research"};
  }
  const header = $userStore ? `${$siteStore.name} - ${$userStore.firstName} ${$userStore.lastName}` : "Admin";
</script>

<Offcanvas isOpen={isOpen} toggle={toggle} header={header} placement="start">

  <hr class="menu-separator"/>

  <span class="menu-header">Content</span>
  <div class="row menu-row">
    <div class="col-1 menu-icon">
      <Icon name="clipboard" />
    </div>
    <div class="col-11 menu-link">
      <Link to="/admin/projects">Projects</Link>
    </div>
  </div>
  <div class="row menu-row">
    <div class="col-1 menu-icon">
      <Icon name="arrow-right-square" />
    </div>
    <div class="col-11 menu-link">
      <Link to="/admin/modules">Modules</Link>
    </div>
  </div>
  <div class="row menu-row">
    <div class="col-1 menu-icon">
      <Icon name="aspect-ratio" />
    </div>
    <div class="col-11 menu-link">
      <Link to="/admin/blocks">Blocks</Link>
    </div>
  </div>
  <div class="row menu-row">
    <div class="col-1 menu-icon">
      <Icon name="file-earmark-medical" />
    </div>
    <div class="col-11 menu-link">
      <Link to="/admin/files">Files</Link>
    </div>
  </div>

  <hr class="menu-separator"/>

  <span class="menu-header">Administration</span>
  <div class="row menu-row">
    <div class="col-1 menu-icon">
      <Icon name="person-workspace" />
    </div>
    <div class="col-11 menu-link">
      <Link to="/admin/users">Users</Link>
    </div>
  </div>
  <div class="row menu-row">
    <div class="col-1 menu-icon">
      <Icon name="clipboard-data" />
    </div>
    <div class="col-11 menu-link">
      <Link to="/admin/reports">Reports</Link>
    </div>
  </div>
  <div class="row menu-row">
    <div class="col-1 menu-icon">
      <Icon name="globe" />
    </div>
    <div class="col-11 menu-link">
      <Link to="/admin/site">Site</Link>
    </div>
  </div>

  <hr class="menu-separator"/>

  <div class="row menu-row">
    <div class="col-1 menu-icon">
      <Icon name="question-circle" />
    </div>
    <div class="col-11 menu-link">
      <Link to="/admin/help">Help</Link>
    </div>
  </div>

</Offcanvas>