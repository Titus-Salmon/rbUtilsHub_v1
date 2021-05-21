<script>
  export let id;
  export let linkName;
  export let imgURL;
  export let altImg;
  export let linkURL;
  export let segment;
</script>

<style>
</style>

<li id="{id}" class="noBullet" style="padding: 1rem 0">
  <a
    aria-current="{segment === { linkURL } ? 'page' : undefined}"
    href="{linkURL}"
    ><img src="{imgURL}" alt="{altImg}" width="150px" />
    <div>
      {linkName}
    </div></a>
</li>
