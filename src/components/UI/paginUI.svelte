<script>
import { onMount } from "svelte";
import paginData from "../../stores/pagination/st_pagination1.js";
import tableData from "../../stores/dynamicTables/tableData1.js";

let currPage;

function paginate(direction) {
  if (typeof $paginData.totalPages === "number") {
    console.log(`$paginData==> ${$paginData}`);
    console.log(`Object.keys($paginData)1==> ${Object.keys($paginData)}`);
    console.log(`Object.values($paginData)1==> ${Object.values($paginData)}`);

    if (direction === "forward") {
      pageToDisplay = $paginData.currentPage + 1;
    }
    if (direction === "reverse") {
      pageToDisplay = $paginData.currentPage - 1;
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
        // paginData.set({
        //   currentPage: queryResJSON.currentPage,
        //   nextPage: queryResJSON.nextPage,
        //   prevPage: queryResJSON.prevPage,
        // }); //passing backend response to frontend "Store"
        // //& we are overwriting the "Store" with set()

        // console.log(`Object.keys($paginData)2==> ${Object.keys($paginData)}`);
        // console.log(
        //   `Object.values($paginData)2==> ${Object.values($paginData)}`
        // );
      });
    //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
    //and at that point we can use this JSON object to do whatever with, such as stringify it, or
    //display it in a table on the frontend
  }
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
    <div style="text-align:center">
      <label for="currPage">Current Page</label>
    </div>
    <div style="text-align:center">
      <input
        type="text"
        id="currPage"
        name="currPage"
        value="{$paginData[0].currentPage}"
        bind:this="{currPage}" />
    </div>
  </div>
  <!--v-- ***nextButton*********************************************************** -->
  <div>
    <div style="text-align:center">
      <!-- <button on:click|preventDefault="{paginate('forward')}">next</button> -->
      <button on:click="{() => paginate('forward')}">next</button>
    </div>
  </div>
</div>
