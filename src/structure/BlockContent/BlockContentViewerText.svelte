<script lang="ts">
  import { MarkdownEditor } from "../.";

  export let content: any;
  if(!content.text){
    content.text = "";
  }
</script>

<MarkdownEditor content={content.text} mode="view" />
