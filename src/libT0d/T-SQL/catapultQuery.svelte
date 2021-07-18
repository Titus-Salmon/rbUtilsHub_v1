<script>
  import paginData from "../../stores/pagination/st_pagination1";
  import tableData from "../../stores/dynamicTables/tableData1";

  import QuerySelectDropdown from "../../components/TSQL/querySelectDropdown.svelte";
  import { Jumper } from "svelte-loading-spinners";

  let isLoading = false;

  function catapultQuery() {
    isLoading = true;

    fetch("server_routes/rt_T-SQL/catapultQuery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: catapultQueryText.value,
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
          `JSON.stringify($paginData) before update from catapultQuery()==> ${JSON.stringify(
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
          `JSON.stringify($paginData) after update from catapultQuery()==> ${JSON.stringify(
            $paginData
          )}`
        );
        if (queryResJSON.error) {
          alert(`err from catapultQuery.svelte==> ${queryResJSON.error}`);
        }

        isLoading = false;
      })
      .catch((err) => {
        alert(`err from catapultQuery.svelte==> ${err}`);
        isLoading = false;
      });
    //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
    //and at that point we can use this JSON object to do whatever with, such as stringify it, or
    //display it in a table on the frontend
  }
</script>

<QuerySelectDropdown />

{#if isLoading}
  <div class="flexbox" margin="1rem">
    <Jumper size="60" color="#FF3E00" unit="px" duration="1s" />
  </div>
{/if}

<button style="display:block; margin: 0 auto 1rem" on:click="{catapultQuery}"
  >catapultQuery</button>
