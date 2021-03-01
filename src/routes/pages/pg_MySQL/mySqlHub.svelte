<script>
import { onMount } from "svelte";
import QueryResultsTable1 from "../../../components/queryResTbls/queryResultsTable1.svelte";
import CalcResTable from "../../../components/queryResTbls/calcResTable.svelte";
import PaginUI from "../../../components/UI/paginUI.svelte";
import DkMdBtn from "../../../components/UI/DkMdBtn.svelte";

import tableData from "../../../stores/dynamicTables/tableData1";
import paginData from "../../../stores/pagination/st_pagination1";
import utilResponses from "../../../stores/utilResponses/st_utilResponses";
import stagingData from "../../../stores/stagingData/st_stagingData.js";
import calcResStore from "../../../stores/calcResults/st_calcResults";
import calcResTableData from "../../../stores/dynamicTables/st_calcResTable";

import RbDbQuery from "../../../libT0d/MySQL/rbDbQuery.svelte";
import SaveToCSV from "../../../libT0d/saveToCSV.svelte";
import SaveToCSVcreatePop from "../../../libT0d/saveToCSVcreatePop.svelte";
import SaveToXLSX from "../../../libT0d/saveToXLSX.svelte";

import CreateTableModal from "../../../components/MySQL/createTableModal.svelte";
import PopRbTableModal from "../../../components/MySQL/popRbTableModal.svelte";
import DeleteRbTableModal from "../../../components/MySQL/deleteRbTableModal.svelte";
import LoadstagingDataModal from "../../../components/MySQL/loadstagingDataModal.svelte";
import StagedDataModal from "../../../components/MySQL/stagedDataModal.svelte";
</script>

<style>
</style>

<DkMdBtn>MODE</DkMdBtn>

<div class="flexbox">
  <CreateTableModal />
  <PopRbTableModal />
  <DeleteRbTableModal />
  <LoadstagingDataModal />
</div>

<RbDbQuery />

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

<div>
  {#if $stagingData[0].stagingDataResponse !== null}
    <p style="text-align:center; color: var(--element6)">
      {Object.values($stagingData[0].stagingDataResponse)}
    </p>
    <p style="text-align:center; color: var(--element6)">
      {JSON.stringify($stagingData[0].stagingDataResponse)}
    </p>
    <StagedDataModal />
  {/if}
</div>

{#if $paginData[0].totalPages !== null}
  <p style="text-align:center; margin: 0">
    Page {$paginData[0].currentPage} of {$paginData[0].totalPages}
  </p>
  <PaginUI />
{/if}

{#if $calcResStore[0].calcResStoreData !== null}
  {console.log(
    `JSON.stringify($paginData[0])==> ${JSON.stringify($paginData[0])}`
  )}
  <CalcResTable />
{:else}
  <QueryResultsTable1 />
{/if}

<!-- <QueryResultsTable1 /> -->
