<script lang="ts">
  import PdfViewer from "svelte-pdf";

  export let pdfURL: string;
</script>

<PdfViewer url={pdfURL} data={null} scale={1.2} />

