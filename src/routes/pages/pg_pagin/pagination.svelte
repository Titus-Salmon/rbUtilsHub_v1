<script>
import { onMount } from "svelte";
import paginData from "../../../stores/pagination/st_pagination1.js";
import tableData from "../../../stores/dynamicTables/tableData1.js";
// let pagin_data;
// paginData.subscribe((paginData_t0d) => (pagin_data = paginData_t0d));

let pageToDisplay = 0;
let forward;
let reverse;

function paginate(direction) {
  console.log(`$paginData==> ${$paginData}`);
  console.log(`Object.keys($paginData)1==> ${Object.keys($paginData)}`);
  console.log(`Object.values($paginData)1==> ${Object.values($paginData)}`);

  if (direction === "forward") {
    pageToDisplay += 1;
  }
  if (direction === "reverse") {
    pageToDisplay -= 1;
  }

  fetch(`server_routes/pagination/rt_pagination?page=${pageToDisplay}`, {
    method: "GET",
  })
    .then((queryRes) => queryRes.json())
    .then((queryResJSON) => {
      console.log(`queryResJSON from pagination.svelte==> ${queryResJSON}`);
      console.log(
        `JSON.stringify(queryResJSON) from pagination.svelte==> ${JSON.stringify(
          queryResJSON
        )}`
      );
      tableData.set(queryResJSON.catapultResArr_pagin); //passing backend response to frontend "Store"
      //& we are overwriting the "Store" with set()
      paginData.set({
        currentPage: queryResJSON.currentPage,
        nextPage: queryResJSON.nextPage,
        prevPage: queryResJSON.prevPage,
      }); //passing backend response to frontend "Store"
      //& we are overwriting the "Store" with set()

      console.log(`Object.keys($paginData)2==> ${Object.keys($paginData)}`);
      console.log(`Object.values($paginData)2==> ${Object.values($paginData)}`);
    });
  //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
  //and at that point we can use this JSON object to do whatever with, such as stringify it, or
  //display it in a table on the frontend
}
</script>

<style>
</style>

<body>
  <!--v-- NOTE: you must use the $ to access the paginData store -->
  {#if typeof $paginData.totalPages === "number"}
    <p>$paginData.totalPages==> {$paginData.totalPages}</p>
    <p>typeof $paginData.totalPages==> {typeof $paginData.totalPages}</p>
  {/if}

  <div class="flexbox">
    <!--v-- ***prevPage*********************************************************** -->
    <!-- <div>
      <div style="text-align:center">
        <label for="prevPage">prevPage</label>
      </div>
      <div style="text-align:center">
        <input
          type="number"
          id="prevPage"
          name="prevPage"
          value="{$paginData.currentPage - 1}"
          bind:this="{pageToDisplay}" />
      </div>
      <div style="text-align:center">
        <button on:click="{paginate}">prevPage</button>
      </div>
    </div> -->
    <!--v-- ***nxtPage*********************************************************** -->
    <!-- <div>
      <div style="text-align:center">
        <label for="nxtPage">nxtPage</label>
      </div>
      <div style="text-align:center">
        <input
          type="number"
          id="nxtPage"
          name="nxtPage"
          value="{$paginData.currentPage + 1}"
          bind:this="{pageToDisplay}" />
      </div>
      <div style="text-align:center">
        <button on:click="{paginate}">nxtPage</button>
      </div>
    </div> -->
    <!--v-- ***pageToDisplay--reverse*********************************************************** -->
    <div>
      <div style="text-align:center">
        <label for="pageToDisplay">pageToDisplay</label>
      </div>
      <!-- <div style="text-align:center">
        <input
          type="number"
          id="pageToDisplay"
          name="pageToDisplay"
          value="{$paginData.currentPage}"
          bind:this="{pageToDisplay}" />
      </div> -->
      <div style="text-align:center">
        <!-- <button bind:this="{reverse}" on:click="{paginate('reverse')}"
          >prev</button> -->
        <button on:click="{paginate('reverse')}">prev</button>
      </div>
    </div>
    <!-- ************************************************************** -->
    <!--v-- ***pageToDisplay--forward*********************************************************** -->
    <div>
      <div style="text-align:center">
        <label for="pageToDisplay">pageToDisplay</label>
      </div>
      <!-- <div style="text-align:center">
        <input
          type="number"
          id="pageToDisplay"
          name="pageToDisplay"
          value="{$paginData.currentPage}"
          bind:this="{pageToDisplay}" />
      </div> -->
      <div style="text-align:center">
        <!-- <button bind:this="{forward}" on:click="{paginate('forward')}"
          >next</button> -->
        <button on:click="{paginate('forward')}">next</button>
      </div>
    </div>
    <!-- ************************************************************** -->
  </div>
</body>
