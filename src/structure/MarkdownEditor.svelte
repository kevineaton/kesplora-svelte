<script lang="ts">
  import * as marked from "marked";

  export let content: string = "";
  export let mode: "view" | "edit" = "view";
  export let hidePreview: boolean = false;
  export let handleChange: any = () => {};

  // note the bind and on:change; sometimes, we pass in an object and can't easily trigger reactivity, so this is a workaround
</script>

<div class="markdown">
  <div class="row">
    {#if mode === "edit"}
      <div class="col">
        <div class="markdown-editor-container">
          <textarea bind:value={content} on:change={handleChange} class="form-control markdown-editor" rows={8}></textarea>
        </div>
      </div>
    {/if}
    {#if !hidePreview}
    <div class="col">
      <div class="markdown-viewer-container">
        <div class="markdown-viewer">
          {@html marked.marked(content)}
        </div>
      </div>
    </div>
    {/if}
  </div>
</div>