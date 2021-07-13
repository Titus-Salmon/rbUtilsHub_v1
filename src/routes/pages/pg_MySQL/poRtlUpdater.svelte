<script>
  import { onMount, onDestroy } from "svelte";
  import MysqlRsTbl from "../../../components/queryResTbls/mysqlResTbl.svelte";
  import PaginUI from "../../../components/UI/paginUI.svelte";
  import DkMdBtn from "../../../components/UI/DkMdBtn.svelte";
  import ShowHideStagedDataBtn from "../../../components/UI/showHideStagedDataBtn.svelte";

  import tableData from "../../../stores/dynamicTables/tableData1";
  import paginData from "../../../stores/pagination/st_pagination1";
  import utilResponses from "../../../stores/utilResponses/st_utilResponses";
  import stagingData from "../../../stores/stagingData/st_stagingData.js";
  import calcResStore from "../../../stores/calcResults/st_calcResults";

  import SaveToCSV from "../../../libT0d/saveToCSV.svelte";
  import SaveToCSVcreatePop from "../../../libT0d/saveToCSVcreatePop.svelte";
  import SaveToXLSX from "../../../libT0d/saveToXLSX.svelte";

  import Save_imw_CSV from "../../../libT0d/save_imw_CSV.svelte";

  import LoadstagingDataModal from "../../../components/MySQL/loadstagingDataModal.svelte";
  import StagedDataModal from "../../../components/MySQL/stagedDataModal.svelte";

  onDestroy(() => {
    //empty pagin and table stores when navigating away from mySqlHub, so pagin and tables don't linger
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

<div class="flexbox">
  <LoadstagingDataModal />
</div>

<!--v-- only show inputs & buttons here if tableData store has been populated with query results -->
<!--v-- NOTE: you must use the $ to access the tableData store -->
{#if Object.keys($tableData).length > 0}
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
    <!-- <p style="text-align:center; color: var(--element6)">
      {Object.values($stagingData[0].stagingDataResponse)}
    </p>
    <p style="text-align:center; color: var(--element6)">
      {JSON.stringify($stagingData[0].stagingDataResponse)}
    </p> -->
    <ShowHideStagedDataBtn>show/hide</ShowHideStagedDataBtn>
    <div id="stagedDataModal">
      <StagedDataModal />
    </div>
  {/if}
</div>

{#if $paginData[0].totalPages !== null}
  <p style="text-align:center; margin: 0">
    Page {$paginData[0].currentPage} of {$paginData[0].totalPages}
  </p>
  <PaginUI />
{/if}

{#if $calcResStore[0].calcResStoreData !== null}
  <!-- {#if $utilResponses[0].utilResponse.save_imw_CSVresponse} -->
  <div class="flexbox">
    <Save_imw_CSV />
  </div>
  <!-- {/if} -->
{/if}

{#if $tableData[0] !== undefined && $tableData[0] !== null}
  {#if Object.keys($tableData[0]).length > 0}
    <!-- <QueryResultsTable1 /> -->
    <MysqlRsTbl />
  {/if}
{/if}
