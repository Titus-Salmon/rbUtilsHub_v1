<script>
import NejQueryModal from "./nejQueryModal.svelte";
import ShowTablesQueryModal from "./showTablesQueryModal.svelte";
import DeleteTablesQueryModal from "./deleteTablesQueryModal.svelte";

let selected;
</script>

<style></style>

<div>
  <label for="querySelect">Select Query:</label>
  <select name="querySelect" id="querySelect" bind:value="{selected}">
    <option value="nej">nej</option>
    <option value="showTables">showTables</option>
    <option value="deleteTables">deleteTables</option>
  </select>
</div>

{#if selected === "nej"}
  <NejQueryModal />
{/if}

{#if selected === "showTables"}
  <ShowTablesQueryModal />
{/if}

{#if selected === "deleteTables"}
  <DeleteTablesQueryModal />
{/if}
