<script>
import { onMount } from "svelte";
import QueryResultsTable1 from "../../../components/queryResTbls/queryResultsTable1.svelte";
import PaginUI from "../../../components/UI/paginUI.svelte";
import DkMdBtn from "../../../components/UI/DkMdBtn.svelte";

import tableData from "../../../stores/dynamicTables/tableData1.js";
import paginData from "../../../stores/pagination/st_pagination1.js";

// import saveToCSV from "../../../libT0d/saveToCSV.js";
// import saveToCSV from "../../../libT0d/saveToCSV_dont_use";
import SaveToCSV from "../../../libT0d/s4v3ToCSV.svelte";

let tsqlQueryText;

let saveToCSVfileName;
let saveToCSVresponse;
// let saveToCSVresultJSON;

let saveToCSVcreatePopFileName;
let saveToCSVcreatePopTableName;
let saveToCSVcreatePopResponse;

let saveToXLSXfileName;
let saveToXLSXresponse;

let queryText = `
SELECT 
inv_ScanCode, ord_supplierstocknumber, inv_name, inv_size, inv_receiptalias, inv_datecreated, inv_default, ord_quantityinorderunit, oup_name, 
sto_number, brd_name, dpt_name, dpt_number, sib_idealMargin, ven_companyname, ven_code, asc_scancode, asc_receiptalias, asc_quantity, 
convert(varchar(10), inv_lastreceived, 120), convert(varchar(10), inv_lastsold, 120), inv_lastcost, sib_baseprice, inv_onhand, inv_onorder, 
inv_intransit, inv_memo, pi1_Description, pi2_Description, pi3_Description, pi4_Description, inv_powerfield1, inv_powerfield2, inv_powerfield3, 
inv_powerfield4 
FROM
catapult.ecrs.v_InventoryMaster 
WHERE trim(ven_companyname) IN ('EDI-ALOE')
AND trim(dpt_number) != '999999' ORDER BY pi1_Description, pi2_Description
`;

function vInvMasterQuery() {
  fetch("server_routes/rt_T-SQL/v_InventoryMasterQuery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: tsqlQueryText.value,
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
        `queryResJSON.queryResArr_1stPage==> ${queryResJSON.queryResArr_1stPage}`
      ); //passing backend response to frontend "Store" & we are overwriting the "Store" with set()
      console.log(
        `JSON.stringify($paginData) before update from vInvMasterQuery()==> ${JSON.stringify(
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
        `JSON.stringify($paginData) after update from vInvMasterQuery()==> ${JSON.stringify(
          $paginData
        )}`
      );
    });
  //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
  //and at that point we can use this JSON object to do whatever with, such as stringify it, or
  //display it in a table on the frontend
}

// function saveToCSV() {
//   fetch("server_routes/saveToCSV", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       data: saveToCSVfileName.value,
//     }),
//   })
//     .then((saveToCSVresult) => saveToCSVresult.json())
//     .then((saveToCSVresultJSON) => {
//       console.log(
//         `JSON.stringify(saveToCSVresultJSON)==> ${JSON.stringify(
//           saveToCSVresultJSON
//         )}`
//       );
//       saveToCSVresponse = saveToCSVresultJSON;
//     });
// }

function saveToCSVcreatePop() {
  fetch("server_routes/saveToCSVcreatePop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fileNameData: saveToCSVcreatePopFileName.value,
      tableNameData: saveToCSVcreatePopTableName.value,
    }),
  })
    .then((saveToCSVcreatePopResult) => saveToCSVcreatePopResult.json())
    .then((saveToCSVcreatePopResultJSON) => {
      console.log(
        `JSON.stringify(saveToCSVcreatePopResultJSON)==> ${JSON.stringify(
          saveToCSVcreatePopResultJSON
        )}`
      );
      saveToCSVcreatePopResponse = saveToCSVcreatePopResultJSON;
    });
}

function saveToXLSX() {
  fetch("server_routes/saveToXLSX", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: saveToXLSXfileName.value,
    }),
  })
    .then((saveToXLSXresult) => saveToXLSXresult.json())
    .then((saveToXLSXresultJSON) => {
      console.log(
        `JSON.stringify(saveToXLSXresultJSON)==> ${JSON.stringify(
          saveToXLSXresultJSON
        )}`
      );
      saveToXLSXresponse = saveToXLSXresultJSON;
    });
}
</script>

<style>
</style>

<DkMdBtn>MODE</DkMdBtn>

<div style="text-align:center">
  <textarea
    class="query"
    id="tsqlQueryText"
    name="tblQryPost"
    cols="160"
    rows="15"
    wrap="soft"
    bind:this="{tsqlQueryText}">
    {queryText}
  </textarea>
</div>

<button style="display:block; margin: 0 auto 1rem" on:click="{vInvMasterQuery}"
  >vInvMasterQuery</button>

<!--v-- only show inputs & buttons here if tableData store has been populated with query results -->
<!--v-- NOTE: you must use the $ to access the tableData store -->
{#if Object.keys($tableData).length > 1}
  <SaveToCSV />
  <div class="flexbox">
    <!--v-- ***saveToCSV*********************************************************** -->
    <div>
      <div style="text-align:center">
        <label for="saveToCSV">File Name</label>
      </div>
      <div style="text-align:center">
        <input
          type="text"
          id="saveToCSV"
          name="saveToCSV"
          bind:this="{saveToCSVfileName}" />
      </div>
      <div style="text-align:center">
        <button on:click="{s4v3ToCSV}">saveToCSV</button>
      </div>
    </div>
    <!--v-- ***save2CSVcreatePop*********************************************************** -->
    <div>
      <div style="text-align:center">
        <label for="saveToCSVcreatePopFileName">File Name</label>
      </div>
      <div style="text-align:center">
        <input
          type="text"
          id="saveToCSVcreatePopFileName"
          name="saveToCSVcreatePopFileName"
          bind:this="{saveToCSVcreatePopFileName}" />
      </div>
      <div style="text-align:center">
        <label for="saveToCSVcreatePopTableName">Table Name</label>
      </div>
      <div style="text-align:center">
        <input
          type="text"
          id="saveToCSVcreatePopTableName"
          name="saveToCSVcreatePopTableName"
          bind:this="{saveToCSVcreatePopTableName}" />
      </div>
      <div style="text-align:center">
        <button on:click="{saveToCSVcreatePop}">save2CSVcreatePop</button>
      </div>
    </div>
    <!--v-- ***saveToXLSX*********************************************************** -->
    <div>
      <div style="text-align:center">
        <label for="saveToXLSX">File Name</label>
      </div>
      <div style="text-align:center">
        <input
          type="text"
          id="saveToXLSX"
          name="saveToXLSX"
          bind:this="{saveToXLSXfileName}" />
      </div>
      <div style="text-align:center">
        <button on:click="{saveToXLSX}">saveToXLSX</button>
      </div>
    </div>
    <!-- ************************************************************** -->
  </div>
{/if}
<!--^-- only show inputs & buttons here if tableData store has been populated with query results -->

{#if saveToCSVresponse !== undefined}
  <p style="text-align:center; color: var(--element6)">
    {Object.values(saveToCSVresponse)}
  </p>
{/if}

<!-- {#if saveToCSV.saveToCSV(saveToCSVfileName).saveToCSVresponse !== undefined}
  <p style="text-align:center; color: var(--element6)">
    {Object.values(saveToCSV.saveToCSV(saveToCSVfileName).saveToCSVresponse)}
  </p>
{/if} -->

<!-- {#if saveToCSV.saveToCSV.saveToCSVresultJSON["response from saveToCSV"] !== undefined}
  <p>{saveToCSV.saveToCSV.saveToCSVresultJSON["response from saveToCSV"]}</p>
{/if} -->

<!-- {#if saveToCSV.saveToCSV.response !== undefined}
  <p>{saveToCSV.saveToCSV.response[0]}</p>
{/if} -->

<!-- {console.log(`saveToCSV.saveToCSV==> ${saveToCSV.saveToCSV}`)}
{console.log(
  `saveToCSV.saveToCSV.saveToCSVresponse==> ${saveToCSV.saveToCSV.saveToCSVresponse}`
)} -->

{#if saveToCSVcreatePopResponse !== undefined}
  <!-- <p style="text-align:center; color: var(--element6)">
    {Object.values(saveToCSVcreatePopResponse)}
  </p> -->
  <p style="text-align:center; color: var(--element6)">
    {saveToCSVcreatePopResponse["response1 from saveToCSVcreatePop"]}
  </p>
  <p style="text-align:center; color: var(--element6)">
    {saveToCSVcreatePopResponse["response2 from saveToCSVcreatePop"]}
  </p>
  <p style="text-align:center; color: var(--element6)">
    {saveToCSVcreatePopResponse["response3 from saveToCSVcreatePop"]}
  </p>
{/if}

{#if saveToXLSXresponse !== undefined}
  <p style="text-align:center; color: var(--element6)">
    {saveToXLSXresponse["response from saveToXLSX"]}
  </p>
{/if}

<!-- <p style="text-align:center">
  JSON.stringify($paginData)==> {JSON.stringify($paginData)}
  Total Pages: {$paginData[0].totalPages}
</p> -->

{#if $paginData[0].totalPages !== null}
  <p style="text-align:center; margin: 0">
    Page {$paginData[0].currentPage} of {$paginData[0].totalPages}
  </p>
  <PaginUI />
{/if}

<QueryResultsTable1 />
