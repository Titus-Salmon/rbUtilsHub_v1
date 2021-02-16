<script>
import paginData from "../../../stores/pagination/st_pagination1.js";
// let pagin_data;
// paginData.subscribe((paginData_t0d) => (pagin_data = paginData_t0d));

let pageToDisplay;

function paginate() {
  fetch("server_routes/pagination/rt_pagination", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: `?page=${pageToDisplay}`,
    }),
  })
    .then((queryRes) => queryRes.json())
    .then((queryResJSON) => {
      tableData.set(queryResJSON.catapultResArr_pagin); //passing backend response to frontend "Store"
      //& we are overwriting the "Store" with set()
      paginData.set({
        currentPage: queryResJSON.currentPage,
        nextPage: queryResJSON.nextPage,
        prevPage: queryResJSON.prevPage,
      }); //passing backend response to frontend "Store"
      //& we are overwriting the "Store" with set()
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
    <div>
      <div style="text-align:center">
        <label for="prevPage">prevPage</label>
      </div>
      <div style="text-align:center">
        <input
          type="text"
          id="prevPage"
          name="prevPage"
          value="{paginData.currentPage - 1}"
          bind:this="{pageToDisplay}" />
      </div>
      <div style="text-align:center">
        <button on:click="{paginate}">prevPage</button>
      </div>
    </div>
    <!--v-- ***nxtPage*********************************************************** -->
    <div>
      <div style="text-align:center">
        <label for="nxtPage">nxtPage</label>
      </div>
      <div style="text-align:center">
        <input
          type="text"
          id="nxtPage"
          name="nxtPage"
          value="{paginData.currentPage + 1}"
          bind:this="{pageToDisplay}" />
      </div>
      <div style="text-align:center">
        <button on:click="{paginate}">nxtPage</button>
      </div>
    </div>
    <!-- ************************************************************** -->
  </div>
</body>
