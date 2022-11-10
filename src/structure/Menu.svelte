<script lang="ts">
  import { Offcanvas } from "sveltestrap";
  import { menuOpenStore } from "../stores";

  export let isOpen = false;
  menuOpenStore.subscribe(newIsOpen => {
    isOpen = newIsOpen;
  })
  const toggle = () => { 
    isOpen = !isOpen;
    menuOpenStore.set(isOpen); 
  };
</script>

<Offcanvas {isOpen} header={"Menu?"} {toggle} placement="start"></Offcanvas>