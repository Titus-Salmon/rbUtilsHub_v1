<script>
import { onMount } from "svelte";
import QueryResultsTable1 from "../../../components/queryResTbls/queryResultsTable1.svelte";
import PaginUI from "../../../components/UI/paginUI.svelte";
import DkMdBtn from "../../../components/UI/DkMdBtn.svelte";

import tableData from "../../../stores/dynamicTables/tableData1.js";
import paginData from "../../../stores/pagination/st_pagination1.js";

let mySqlQueryText;

let saveToCSVfileName;
let saveToCSVresponse;

let saveToCSVcreatePopFileName;
let saveToCSVcreatePopTableName;
let saveToCSVcreatePopResponse;

let saveToXLSXfileName;
let saveToXLSXresponse;

let queryText = `
SELECT 
nhcrt.ri_t0d, nhcrt.inv_ScanCode, nhcrt.ord_supplierstocknumber, nhcrt.inv_name, nhcrt.inv_size, nhcrt.inv_receiptalias, nhcrt.inv_datecreated, 
nhcrt.ord_quantityinorderunit, nhcrt.oup_name, nhcrt.sto_number, nhcrt.brd_name, nhcrt.dpt_name, nhcrt.dpt_number, nhcrt.sib_idealmargin, 
nhcrt.actlMarg, nhcrt.ven_companyname, nhcrt.ven_code, nhcrt.asc_scancode, nhcrt.asc_receiptalias, nhcrt.asc_quantity, nhcrt.inv_lastcost, 
nhcrt.sib_baseprice, nhcrt.pi1_description, nhcrt.pi2_description, nhcrt.pi3_description, nhcrt.inv_powerfield3, nhcrt.inv_powerfield4, 

edi_table.* 

FROM nhcrtTableName 

nhcrt JOIN ediTableName edi_table 
ON nhcrt.inv_ScanCode 
WHERE nhcrt.inv_ScanCode = edi_table.ediPrefix_upc 

ORDER BY nhcrt.pi1_description, nhcrt.pi1_description;
`;

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
        `queryResJSON.queryResArr_1stPage==> ${queryResJSON.queryResArr_1stPage}`
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

function saveToCSV() {
  fetch("server_routes/rt_T-SQL/saveToCSV", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: saveToCSVfileName.value,
    }),
  })
    .then((saveToCSVresult) => saveToCSVresult.json())
    .then((saveToCSVresultJSON) => {
      console.log(
        `JSON.stringify(saveToCSVresultJSON)==> ${JSON.stringify(
          saveToCSVresultJSON
        )}`
      );
      saveToCSVresponse = saveToCSVresultJSON;
    });
}

function saveToCSVcreatePop() {
  fetch("server_routes/rt_T-SQL/saveToCSVcreatePop", {
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
  fetch("server_routes/rt_T-SQL/saveToXLSX", {
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
    id="mySqlQueryText"
    name="tblQryPost"
    cols="160"
    rows="15"
    wrap="soft"
    bind:this="{mySqlQueryText}">
    {queryText}
  </textarea>
</div>

<button style="display:block; margin: 0 auto 1rem" on:click="{rbDBquery}"
  >rbDBquery</button>

<!--v-- only show inputs & buttons here if tableData store has been populated with query results -->
<!--v-- NOTE: you must use the $ to access the tableData store -->
{#if Object.keys($tableData).length > 1}
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
        <button on:click="{saveToCSV}">saveToCSV</button>
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
