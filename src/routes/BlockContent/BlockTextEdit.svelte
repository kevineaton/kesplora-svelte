<script lang="ts">
  import { MarkdownEditor } from "../../structure";

  export let content: any = {};
  if(!content.text){
    content.text = "";
  }
  
  const handleChange = (e: any) => {
    content.text = e.target.value;
    content = content;
  }
</script>

<div class="block-edit-container">
  <div class="form-group">
    <label for="block-text-edit-text">Text to Display</label>
    <MarkdownEditor content={content.text} handleChange={handleChange} mode="edit" />
  </div>
</div>
