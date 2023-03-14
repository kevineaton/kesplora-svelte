<script type="ts">
  import Flatpickr from "svelte-flatpickr";

  export let id: string = "date";
  export let value: any = Date.now();
  export let enableTime = false;
  export let onSave: any = () => {};
  export let altInput = true;
  export let altFormat = "F j, Y";
  export let dateFormat = "Y-m-d";
</script>

<Flatpickr {id} class="form-control" bind:value={value} options={{
  enableTime,
  onChange: onSave,
  defaultDate: value,
  altFormat,
  altInput,
  dateFormat
}}/>