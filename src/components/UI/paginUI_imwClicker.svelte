<script>
  import { onMount } from "svelte";
  import paginData from "../../stores/pagination/st_pagination1.js";
  import imwClickerResTblData from "../../../stores/dynamicTables/st_imwClickerResTbl";

  let page;
  let pageToDisplay;

  async function paginate(page) {
    console.log(`$paginData[0]==> ${$paginData[0]}`);
    console.log(`Object.keys($paginData[0])1==> ${Object.keys($paginData[0])}`);
    console.log(
      `Object.values($paginData[0])1==> ${Object.values($paginData[0])}`
    );

    if (page === "forward") {
      //don't go forward if you're at the last page
      if ($paginData[0].currentPage + 1 <= $paginData[0].totalPages) {
        pageToDisplay = $paginData[0].currentPage + 1;
      } else {
        return alert(`You're already at the last page.`);
      }
    }
    if (page === "reverse") {
      //don't go backwards if you're at the 1st page
      if ($paginData[0].currentPage - 1 >= 1) {
        pageToDisplay = $paginData[0].currentPage - 1;
      } else {
        return alert(`You can't go back further than the 1st page.`);
      }
    }
    //what to do when user types value into "goTo" input
    if (page !== "forward" && page !== "reverse") {
      console.log(`typeof page from paginate(page)==> ${typeof page}`);
      //don't go to pages outside range of possible values
      if (page <= $paginData[0].totalPages && page >= 1) {
        pageToDisplay = page;
      } else {
        return alert(
          `The value you've entered isn't in the range of possible pages.`
        );
      }
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
        imwClickerResTblData.set(queryResJSON.queryResArr_pagin); //passing backend response to frontend "Store"
        //& we are overwriting the "Store" with set()
        paginData.update((currentData) => {
          currentData = [
            {
              totalPages: queryResJSON.totalPages,
              currentPage: queryResJSON.currentPage,
              // nextPage: queryResJSON.nextPage,
              // prevPage: queryResJSON.prevPage,
            },
          ];
          return currentData;
        });
      });
    //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
    //and at that point we can use this JSON object to do whatever with, such as stringify it, or
    //display it in a table on the frontend
  }
</script>

<style>
</style>

<div class="flexbox">
  <!--v-- ***prevButton*********************************************************** -->
  <div>
    <div style="text-align:center">
      <button on:click="{() => paginate('reverse')}">prev</button>
    </div>
  </div>
  <!--v-- ***currPageDispl*********************************************************** -->
  <div>
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
