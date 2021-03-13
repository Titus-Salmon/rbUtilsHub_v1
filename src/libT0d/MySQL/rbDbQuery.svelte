<script>
import paginData from "../../stores/pagination/st_pagination1";
import tableData from "../../stores/dynamicTables/tableData1";

import QuerySelectDropdown from "../../components/MySQL/querySelectDropdown.svelte";

function rbDBquery() {
  fetch("server_routes/rt_MySQL/RBDBQuery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: mySqlQueryText.value,
    }),
  })
    .then((queryRes) => queryRes.json())
    //^//not certain how this works, but the best I can describe for now is as follows:
    //[1] the "queryRes" argument represents the result of the previous fetch()
    //[2] this result must then be converted to JSON via the json() method on the frontend, even though it was already sent
    //from the backend as JSON
    .then((queryResJSON) => {
      tableData.set(queryResJSON.queryResArr_1stPage);
      console.log(
        `JSON.stringify(queryResJSON.queryResArr_1stPage)==> ${JSON.stringify(
          queryResJSON.queryResArr_1stPage
        )}`
      ); //passing backend response to frontend "Store" & we are overwriting the "Store" with set()
      console.log(
        `JSON.stringify($paginData) before update from rbDBquery()==> ${JSON.stringify(
          $paginData
        )}`
      );
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
      // paginData.set([
      //   {
      //     totalPages: queryResJSON.totalPages,
      //     currentPage: queryResJSON.currentPage,
      //     nextPage: queryResJSON.nextPage,
      //     prevPage: queryResJSON.prevPage,
      //   },
      // ]);
      console.log(
        `JSON.stringify($paginData) after update from rbDBquery()==> ${JSON.stringify(
          $paginData
        )}`
      );
    });
  //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
  //and at that point we can use this JSON object to do whatever with, such as stringify it, or
  //display it in a table on the frontend
}
</script>

<QuerySelectDropdown />

<button style="display:block; margin: 0 auto 1rem" on:click="{rbDBquery}"
  >rbDBquery</button>
