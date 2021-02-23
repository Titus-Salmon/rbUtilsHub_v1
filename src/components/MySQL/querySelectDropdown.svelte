<script>
import NejQueryModal from "./nejQueryModal.svelte";
import ShowTablesQueryModal from "./showTablesQueryModal.svelte";

// const querySelect = window.document.getElementById("querySelect");
// const selectedQuery = querySelect.options[querySelect.selectedIndex].value;
let querySelect;
</script>

<style></style>

<div>
  <select name="querySelect" id="querySelect" bind:this="{querySelect}">
    <option value="nej">nej</option>
    <option value="showTables">showTables</option>
    <option value="createNhcrt">createNhcrt</option>
    <option value="createNej">createNej</option>
    <option value="populateTable">populateTable</option>
    <option value="deleteTables">deleteTables</option>
  </select>
</div>

{#if querySelect.options[querySelect.selectedIndex].value === "nej"}
  <NejQueryModal />
{/if}

{#if querySelect.options[querySelect.selectedIndex].value === "showTables"}
  <ShowTablesQueryModal />
{/if}
