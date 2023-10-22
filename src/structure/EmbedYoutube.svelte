<script lang="ts">
  import Youtube from "svelte-youtube-embed";

  export let video: string;
  // if it's a link, get the id
  if(video.indexOf("http") !== -1){
    const url = new URL(video);
    // so there's two forms we currently support; either the full url with ?v= or the shortened youtu.be
    if(video.indexOf("youtu.be/") !== -1){
      // it's the shortened one so split
      const p = url.pathname;
      video = p.substring(1);
    } else {
      const v = url.searchParams.get("v");
      if(v !== ""){
        video = v;
      }
    }
  }
  // for now, we just embed, but in the future, we may want a custom thumbnail, overlay, etc
</script>

<Youtube id={video} />