<script>
import NejQueryModal from "./queryModals/nejQueryModal.svelte";
import ShowTablesQueryModal from "./queryModals/showTablesQueryModal.svelte";
import SpinsQueryModal1 from "./queryModals/spinsQueryModal1.svelte";
import CompEdiNhcrt from "./queryModals/compEdiNhcrt.svelte";

import stagingData from "../../stores/stagingData/st_stagingData";

let selected;
</script>

<style></style>

<div style="padding-left: 6rem">
  <label for="querySelect">Select Query:</label>
  <select name="querySelect" id="querySelect" bind:value="{selected}">
    <option value="nej">nej</option>
    <option value="showTables">showTables</option>
    <option value="spins1">spins1</option>
    <option value="compEdiNhcrt">compEdiNhcrt</option>
    <!-- <option value="calcResults">calcResults</option> -->
  </select>
</div>

<!-- {#if $stagingData[0].stagingDataResponse !== null}
  {selected === "calcResults"}
  <CalcResultsQueryModal />
{/if} -->

{#if selected === "nej"}
  <NejQueryModal />
{/if}

{#if selected === "showTables"}
  <ShowTablesQueryModal />
{/if}

{#if selected === "spins1"}
  <SpinsQueryModal1 />
{/if}

{#if selected === "compEdiNhcrt"}
  <CompEdiNhcrt />
{/if}
