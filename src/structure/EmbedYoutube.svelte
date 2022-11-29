<script lang="ts">
  import Youtube from "svelte-youtube-embed";

  export let video: string;
  // if it's a link, get the id
  if(video.indexOf("http") !== -1){
    const url = new URL(video);
    const v = url.searchParams.get("v");
    if(v !== ""){
      video = v;
    }
  }
  // for now, we just embed, but in the future, we may want a custom thumbnail, overlay, etc
</script>

<Youtube id={video} />