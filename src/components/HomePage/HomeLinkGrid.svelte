<script>
  import HomeLink from "./HomeLink.svelte";
  export let homeLinks;
</script>

<style></style>

<div class="flexbox">
  <div class="grid-container rainbow-gradient">
    {#each homeLinks as homeLink}
      <div class="grid-item">
        <HomeLink
          segment="{homeLink.segment}"
          id="{homeLink.id}"
          linkName="{homeLink.linkName}"
          imgURL="{homeLink.imgURL}"
          altImg="{homeLink.altImg}"
          linkURL="{homeLink.linkURL}" />
      </div>
    {/each}
  </div>
</div>
