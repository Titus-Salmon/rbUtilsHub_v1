<script>
import DkMdBtn from "../components/UI/DkMdBtn.svelte"; //t0d
// import V_InventoryMasterQueryResults from "../components/T-SQL/v_InventoryMasterQueryResults.svelte"; //t0d

export let segment;
</script>

<style>
nav {
  border-bottom: 1px solid rgba(255, 62, 0, 0.1);
  font-weight: 300;
  padding: 0 1em;
}
ul {
  margin: 0;
  padding: 0;
}
/* clearfix */
ul::after {
  content: "";
  display: block;
  clear: both;
}
li {
  display: block;
  float: left;
}
[aria-current] {
  position: relative;
  display: inline-block;
}
[aria-current]::after {
  position: absolute;
  content: "";
  width: calc(100% - 1em);
  height: 2px;
  background-color: rgb(255, 62, 0);
  display: block;
  bottom: -1px;
}
a {
  text-decoration: none;
  padding: 1em 0.5em;
  display: block;
}
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
