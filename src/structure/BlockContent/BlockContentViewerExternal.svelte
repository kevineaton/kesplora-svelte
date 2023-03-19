<script lang="ts">
  export let content: any;
  if(!content.externalLink){
    content.externalLink = "";
  }
</script>

<a href={content.externalLink} target="_new">Open In New Window</a>