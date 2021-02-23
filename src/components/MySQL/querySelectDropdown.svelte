<script>
import NejQueryModal from "./nejQueryModal.svelte";
import ShowTablesQueryModal from "./showTablesQueryModal.svelte";

// const querySelect = window.document.getElementById("querySelect");
// const selectedQuery = querySelect.options[querySelect.selectedIndex].value;
let querySelect;
</script>

<style></style>

<div>
  <select name="querySelect" id="querySelect">
    <option value="nej" bind:this="{querySelect}">nej</option>
    <option value="showTables" bind:this="{querySelect}">showTables</option>
    <option value="createNhcrt" bind:this="{querySelect}">createNhcrt</option>
    <option value="createNej" bind:this="{querySelect}">createNej</option>
    <option value="populateTable" bind:this="{querySelect}"
      >populateTable</option>
    <option value="deleteTables" bind:this="{querySelect}">deleteTables</option>
  </select>
</div>

{#if querySelect.value === "nej"}
  <NejQueryModal />
{/if}

{#if querySelect.value === "showTables"}
  <ShowTablesQueryModal />
{/if}
