<script>
import { onMount, onDestroy } from "svelte";
import QueryResultsTable1 from "../../../components/queryResTbls/queryResultsTable1.svelte";
import PaginUI from "../../../components/UI/paginUI.svelte";
import DkMdBtn from "../../../components/UI/DkMdBtn.svelte";
import ShowHideStagedDataBtn from "../../../components/UI/showHideStagedDataBtn.svelte";

import tableData from "../../../stores/dynamicTables/tableData1";
import paginData from "../../../stores/pagination/st_pagination1";
import utilResponses from "../../../stores/utilResponses/st_utilResponses";
import stagingData from "../../../stores/stagingData/st_stagingData.js";
import calcResStore from "../../../stores/calcResults/st_calcResults";

import RbDbQuery from "../../../libT0d/MySQL/rbDbQuery.svelte";
import SaveToCSV from "../../../libT0d/saveToCSV.svelte";
import SaveToCSVcreatePop from "../../../libT0d/saveToCSVcreatePop.svelte";
import SaveToXLSX from "../../../libT0d/saveToXLSX.svelte";

import Save_imw_CSV from "../../../libT0d/save_imw_CSV.svelte";

import CreateTableModal from "../../../components/MySQL/createTableModal.svelte";
import PopRbTableModal from "../../../components/MySQL/popRbTableModal.svelte";
import DeleteRbTableModal from "../../../components/MySQL/deleteRbTableModal.svelte";
import LoadstagingDataModal from "../../../components/MySQL/loadstagingDataModal.svelte";
import StagedDataModal from "../../../components/MySQL/stagedDataModal.svelte";

onDestroy(() => {
  return location.reload();
  //why does this work exactly?
  //the problem was that before, when switching from mySqlHub to tsqlHub, we'd get an error along the lines of
  //"can't read property getElementsByTagName of undefined" from queryResultsTable1.svelte. The relevant code from queryResultsTable1.svelte
  //was const tblCells = rsltTblBdy.getElementsByTagName("td"). So when switching from mysqlHub to tsqlHub page, rsltTblBody
  //somehow became undefined. That in itself doesn't make sense, because rsltTblBdy is defined as
  //const rsltTblBdy = document.getElementById("rsltTblBdy") (that's the ID of the table body) in queryResultsTable1.svelte, and the
  //function that sets that definition is only called if there is some data in the table store...
  //At any rate, one of the effects of loction.reload() is to clear the cache, so presumably clearing the cache when exiting this
  //mySqlHub.svelte component (upon clicking the link to tsqlHub) clears something that was throwing this error.
  //Presumably the thing that was throwing the error was the tableHighlight() function called in queryResultsTable1.svelte
  //so clearing the cache clears the function call, and since the function is no longer being called before tsqlHub has a chance to
  //load it's queryResultsTable, no error is thrown.

  //In fact, remember that in a different branch (dev29?) we had set up different queryResultsTables; one for mysql and one for tsql,
  //but we still had this error. Therefore, the error is being thrown exclusively by mysqlHub.svelte/queryResultsTable1 at the end
  //of that component's lifecycle. So really the only thing that makes sense at this point is that the error is being thrown
  //because at the end of queryResultsTable1 lifecycle, tableHighlight() is still cached, but as we are beginning to build the DOM
  //for tsqlHub when switching over to that page, there is a moment when there is actually no queryResultsTable1 any more, yet
  //tableHighlight() is still being called from the cache
  //^//I'm not sure if this is really the case or not, but it seems like there must be some better way to deal with this issue
  //maybe we could try calling tableHighlight within onMount, instead.
});
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

<QueryResultsTable1 />
