<script>
import NejQueryModal from "./nejQueryModal.svelte";
import ShowTablesQueryModal from "./showTablesQueryModal.svelte";

// const querySelect = window.document.getElementById("querySelect");
// const selectedQuery = querySelect.options[querySelect.selectedIndex].value;
// let querySelect;
let selected;
</script>

<style></style>

<div>
  <select name="querySelect" id="querySelect" bind:value="{selected}">
    <option value="nej">nej</option>
    <option value="showTables">showTables</option>
    <option value="createNhcrt">createNhcrt</option>
    <option value="createNej">createNej</option>
    <option value="populateTable">populateTable</option>
    <option value="deleteTables">deleteTables</option>
  </select>

  <!-- <select bind:value="{selected}" on:change="{() => (concs = selected)}">
    ...
  </select> -->
</div>

{#if selected === "nej"}
  <NejQueryModal />
{/if}

{#if selected === "showTables"}
  <ShowTablesQueryModal />
{/if}
