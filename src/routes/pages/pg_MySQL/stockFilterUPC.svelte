<script>
  import { onMount, onDestroy } from "svelte";
  import QueryResultsTable1 from "../../../components/queryResTbls/queryResultsTable1.svelte";
  // import PaginUI from "../../../components/UI/paginUI.svelte";
  // import paginData from "../../stores/pagination/st_pagination1";
  import tableData from "../../../stores/dynamicTables/tableData1";
  import utilResponses from "../../../stores/utilResponses/st_utilResponses";

  import SaveToXLSX from "../../../libT0d/saveToXLSX.svelte";

  import { Jumper } from "svelte-loading-spinners";

  let isLoading = false;
  let tableName;
  function stockFilterUPC() {
    isLoading = true;

    fetch("server_routes/rt_MySQL/stockFilterUPC", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tableName: tableName.value,
      }),
    })
      .then((queryRes) => queryRes.json())
      .then((queryResJSON) => {
        tableData.set(queryResJSON.allStoresResults);
        console.log(
          `JSON.stringify(queryResJSON.allStoresResults[0])==> ${JSON.stringify(
            queryResJSON.allStoresResults[0]
          )}`
        ); //passing backend response to frontend "Store" & we are overwriting the "Store" with set()
        // console.log(
        //   `JSON.stringify($paginData) before update from stockFilterUPC()==> ${JSON.stringify(
        //     $paginData
        //   )}`
        // );
        // paginData.update((currentData) => {
        //   currentData = [
        //     {
        //       totalPages: queryResJSON.totalPages,
        //       currentPage: queryResJSON.currentPage,
        //       nextPage: queryResJSON.nextPage,
        //       prevPage: queryResJSON.prevPage,
        //     },
        //   ];
        //   return currentData;
        // });
        // console.log(
        //   `JSON.stringify($paginData) after update from stockFilterUPC()==> ${JSON.stringify(
        //     $paginData
        //   )}`
        // );
        if (queryResJSON.error !== null) {
          alert(`err from stockFilterUPC.svelte==> ${queryResJSON.error}`);
        }

        isLoading = false;
      })
      .catch((err) => {
        alert(`err from stockFilterUPC.svelte==> ${err}`);
        isLoading = false;
      });
  }

  onDestroy(() => {
    //empty table stores when navigating away, so tables don't linger
    tableData.set([{}]);
  });
</script>

<style></style>

<div style="padding: 0 1rem">
  <!-- //////////////table name//////////////////////////// -->
  <div style="text-align:center;">
    <label for="tableName">nhcrt Table name for Stock Filter</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="tableName"
      name="tableName"
      required
      bind:this="{tableName}" />
  </div>

  {#if isLoading}
    <div class="flexbox" margin="1rem">
      <Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
    </div>
  {/if}

  <!-- //////////////button//////////////////////////// -->
  <div style="text-align:center">
    <button on:click="{stockFilterUPC}">stockFilterUPC</button>
  </div>
</div>

<!--v-- only show inputs & buttons here if tableData store has been populated with query results -->
<!--v-- NOTE: you must use the $ to access the tableData store -->
{#if Object.keys($tableData).length > 0}
  <div class="flexbox">
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

<!-- {#if $paginData[0].totalPages !== null}
  <p style="text-align:center; margin: 0">
    Page {$paginData[0].currentPage} of {$paginData[0].totalPages}
  </p>
  <PaginUI />
{/if} -->

{#if $tableData[0] !== undefined && $tableData[0] !== null}
  {#if Object.keys($tableData[0]).length > 0}
    <QueryResultsTable1 />
  {/if}
{/if}
