<script>
import NejQueryModal from "./nejQueryModal.svelte";
import ShowTablesQueryModal from "./showTablesQueryModal.svelte";

const querySelect = window.document.getElementById("querySelect");
const selectedQuery = querySelect.options[querySelect.selectedIndex].value;
</script>

<style></style>

<div>
  <select name="querySelect" id="querySelect">
    <option value="nej">nej</option>
    <option value="showTables">showTables</option>
    <option value="createNhcrt">createNhcrt</option>
    <option value="createNej">createNej</option>
    <option value="populateTable">populateTable</option>
    <option value="deleteTables">deleteTables</option>
  </select>
</div>

{#if selectedQuery === "nej"}
  <NejQueryModal />
{/if}

{#if selectedQuery === "showTables"}
  <ShowTablesQueryModal />
{/if}
