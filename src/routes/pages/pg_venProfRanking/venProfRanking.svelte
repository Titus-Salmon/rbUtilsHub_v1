<script>
  import { onMount, onDestroy } from "svelte";
  import generalTableData from "../../../stores/dynamicTables/generalTableData";
  import GeneralResTbl from "../../../components/queryResTbls/generalResTbl.svelte";
  import SaveToXLSX from "../../../libT0d/saveToXLSX.svelte";

  let queryText;

  let query = `
  SELECT nhcrt.*, optItemSales.* FROM <<nhcrtTableName>> 
  nhcrt JOIN <<optItemSalesTable>> optItemSales 
  ON nhcrt.invScanCode 
  WHERE nhcrt.invScanCode = optItemSales.itemID 
  ORDER BY nhcrt.venCompanyname, nhcrt.pi1Description, nhcrt.pi2Description
  `;

  function venProfRanking() {
    fetch("server_routes/rt_venProfRanking/venProfRanking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        queryText: queryText.value,
      }),
    })
      .then((venProfRankingRes) => venProfRankingRes.json())
      .then((venProfRankingResJSON) => {
        generalTableData.set(venProfRankingResJSON.vendorTotalsObjArr);
        console.log(
          `JSON.stringify(venProfRankingResJSON.vendorTotalsObjArr)==> ${JSON.stringify(
            venProfRankingResJSON.vendorTotalsObjArr
          )}`
        ); //passing backend response to frontend "Store" & we are overwriting the "Store" with set()
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
      });
    //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
    //and at that point we can use this JSON object to do whatever with, such as stringify it, or
    //display it in a table on the frontend
  }
  onDestroy(() => {
    generalTableData.set([{}]);
  });
</script>

<div style="text-align:center">
  <textarea
    class="query"
    id="query"
    cols="33"
    rows="3"
    wrap="soft"
    bind:this="{queryText}">
    {query}
  </textarea>
</div>

<!-- //////////////button//////////////////////////// -->
<div style="text-align:center">
  <button on:click="{venProfRanking}">venProfRanking</button>
</div>

<!-- /////////// -->

{#if $generalTableData[0]}
  <!-- {#if Object.keys($generalTableData[0]).length > 0} -->
  <GeneralResTbl />
  <!-- {/if} -->
{/if}
