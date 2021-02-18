<script>
import { onMount } from "svelte";
import paginData from "../../stores/pagination/st_pagination1.js";
import tableData from "../../stores/dynamicTables/tableData1.js";

let page;
let pageToDisplay;
let pageBlurb;
// let pageBlurb = `Page ${$paginData[0].currentPage} of ${$paginData[0].totalPages}`;
// if ($paginData[0].totalPages !== null) {
//   pageBlurb = `Page ${$paginData[0].currentPage} of ${$paginData[0].totalPages}`;
// } else {
//   pageBlurb = `Page ${$paginData[0].currentPage}`;
// }

function paginate(page) {
  //if (typeof $paginData.totalPages === "number") {
  console.log(`$paginData[0]==> ${$paginData[0]}`);
  console.log(`Object.keys($paginData[0])1==> ${Object.keys($paginData[0])}`);
  console.log(
    `Object.values($paginData[0])1==> ${Object.values($paginData[0])}`
  );

  if (page === "forward") {
    pageToDisplay = $paginData[0].currentPage + 1;
  }
  if (page === "reverse") {
    pageToDisplay = $paginData[0].currentPage - 1;
  }
  if (page !== "forward" && page !== "reverse") {
    console.log(`typeof page from paginate(page)==> ${typeof page}`);
    pageToDisplay = page;
  }

  fetch(`server_routes/pagination/rt_pagination?page=${pageToDisplay}`, {
    method: "GET",
  })
    .then((queryRes) => queryRes.json())
    .then((queryResJSON) => {
      console.log(`queryResJSON from paginUI.svelte==> ${queryResJSON}`);
      console.log(
        `JSON.stringify(queryResJSON) from paginUI.svelte==> ${JSON.stringify(
          queryResJSON
        )}`
      );
      tableData.set(queryResJSON.catapultResArr_pagin); //passing backend response to frontend "Store"
      //& we are overwriting the "Store" with set()
      paginData.update((currentData) => {
        currentData = [
          {
            totalPages: queryResJSON.totalPages,
            currentPage: queryResJSON.currentPage,
            nextPage: queryResJSON.nextPage,
            prevPage: queryResJSON.prevPage,
          },
        ];
        return currentData;
      });
    });
  //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
  //and at that point we can use this JSON object to do whatever with, such as stringify it, or
  //display it in a table on the frontend
  //}
}
</script>

<style>
</style>

<div class="flexbox">
  <!--v-- ***prevButton*********************************************************** -->
  <div>
    <div style="text-align:center">
      <!-- <button on:click|preventDefault="{paginate('reverse')}">prev</button> -->
      <button on:click="{() => paginate('reverse')}">prev</button>
    </div>
  </div>
  <!--v-- ***currPageDispl*********************************************************** -->
  <div>
    <!-- {#if $paginData[0].totalPages !== null}
      {(pageBlurb = `Page ${$paginData[0].currentPage} of ${$paginData[0].totalPages}`)}
      <div style="text-align:center">
        <label for="page">{pageBlurb}</label>
      </div>
    {:else}
      <div style="text-align:center">
        <label for="page">Page</label>
      </div>
    {/if} -->
    <div style="text-align:center">
      <label for="page">Page</label>
    </div>
    <div style="text-align:center">
      <input
        style="text-align: center"
        type="text"
        id="page"
        name="page"
        size="2"
        value="{$paginData[0].currentPage}"
        bind:this="{page}" />
    </div>
    <div style="text-align:center">
      <button on:click="{() => paginate(page.value)}">goTo</button>
    </div>
  </div>
  <!--v-- ***nextButton*********************************************************** -->
  <div>
    <div style="text-align:center">
      <button on:click="{() => paginate('forward')}">next</button>
    </div>
  </div>
</div>
