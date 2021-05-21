<script>
  import DkMdBtn from "../components/UI/DkMdBtn.svelte"; //t0d
  import HomeLinkGrid from "../components/HomePage/HomeLinkGrid.svelte";
  import homeLinks from "../components/HomePage/homeLinksObjArr";
</script>

<style>
</style>

<svelte:head>
  <title>rbUtilsHub_v1</title>
</svelte:head>

<DkMdBtn>MODE</DkMdBtn>

<HomeLinkGrid homeLinks="{homeLinks}" />
