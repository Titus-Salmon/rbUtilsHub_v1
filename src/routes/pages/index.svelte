<script>
import DkMdBtn from "../components/UI/DkMdBtn.svelte"; //t0d
// import V_InventoryMasterQueryResults from "../components/T-SQL/v_InventoryMasterQueryResults.svelte"; //t0d

export let segment;
</script>

<style>
</style>

<svelte:head>
  <title>rbUtilsHub_v1</title>
</svelte:head>

<DkMdBtn>MODE</DkMdBtn>

<ul>
  <!-- <li>
    <a aria-current="{segment === undefined ? 'page' : undefined}" href="."
      >index</a>
  </li> -->
  <li>
    <a
      aria-current="{segment === 'tsqlHub' ? 'page' : undefined}"
      href="/pages/pg_T-SQL/tsqlHub">tsqlHub</a>
  </li>
</ul>
