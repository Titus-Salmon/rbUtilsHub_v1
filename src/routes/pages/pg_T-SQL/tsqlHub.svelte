<script>
import { onMount, onDestroy } from "svelte";
import QueryResultsTable1 from "../../../components/queryResTbls/queryResultsTable1.svelte";
import PaginUI from "../../../components/UI/paginUI.svelte";
import DkMdBtn from "../../../components/UI/DkMdBtn.svelte";

import tableData from "../../../stores/dynamicTables/tableData1";
import paginData from "../../../stores/pagination/st_pagination1";
import utilResponses from "../../../stores/utilResponses/st_utilResponses";

import VInvMasterQuery from "../../../libT0d/T-SQL/vInvMasterQuery.svelte";
import SaveToCSV from "../../../libT0d/saveToCSV.svelte";
import SaveToCSVcreatePop from "../../../libT0d/saveToCSVcreatePop.svelte";
import SaveToXLSX from "../../../libT0d/saveToXLSX.svelte";

onDestroy(() => {
  paginData.set([
    {
      totalPages: null,
      currentPage: null,
    },
  ]);

  tableData.set([{}]);
});
</script>

<style>
</style>

<DkMdBtn>MODE</DkMdBtn>

<VInvMasterQuery />

<!--v-- only show inputs & buttons here if tableData store has been populated with query results -->
<!--v-- NOTE: you must use the $ to access the tableData store -->
{#if Object.keys($tableData).length > 1}
  <div class="flexbox">
    <SaveToCSV />
    <SaveToCSVcreatePop />
    <SaveToXLSX />
  </div>
{/if}
<!--^-- only show inputs & buttons here if tableData store has been populated with query results -->

<div>
  {#if $utilResponses[0].utilResponse !== null}
    <p style="text-align:center; color: var(--element6)">
      {Object.values($utilResponses[0].utilResponse)}
    </p>
  {/if}
</div>

{#if $paginData[0].totalPages !== null}
  <p style="text-align:center; margin: 0">
    Page {$paginData[0].currentPage} of {$paginData[0].totalPages}
  </p>
  <PaginUI />
{/if}

<QueryResultsTable1 />
