<script>
import { onMount } from "svelte";
import V_InventoryMasterQueryResultsTable from "../../../components/T-SQL/v_InventoryMasterQueryResults.svelte";
import tableData from "../../../stores/dynamicTables/tableData1.js";
import DkMdBtn from "../../../components/UI/DkMdBtn.svelte";

let tsqlQueryText;

let saveToCSVfileName;
let saveToCSVresponse;

let saveToCSVcreatePopFileName;
let saveToCSVcreatePopTableName;
let saveToCSVcreatePopResponse;

let saveToXLSXfileName;
let saveToXLSXresponse;

let queryText = `
SELECT 
INV_PK, INV_CPK, INV_ScanCode, ORD_SupplierStockNumber, INV_Name, INV_Size, INV_ReceiptAlias, inv_default, convert(varchar(10), 
POS_TimeStamp, 120), INV_DateCreated, INV_EMP_FK_CreatedBy, ord_quantityinorderunit, oup_name, sto_number, brd_name, dpt_name, dpt_number, 
SIB_IdealMargin, ven_companyname, convert(varchar(10), inv_lastreceived, 120), convert(varchar(10), inv_lastsold, 120), 
inv_lastcost, SIB_BasePrice, inv_onhand, inv_onorder, inv_intransit, inv_memo, PI1_Description, PI2_Description, PI3_Description, 
PI4_Description, INV_PowerField1, INV_PowerField2, INV_PowerField3, INV_PowerField4 
FROM
catapult.ecrs.v_InventoryMaster 
WHERE trim(ven_companyname) IN ('EDI-ALOE')
AND trim(dpt_number) != '999999' ORDER BY PI1_Description, PI2_Description
`;

function vInvMasterQuery() {
  fetch("server_routes/rt_T-SQL/v_InventoryMasterQuery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //'Access-Control-Allow-Origin': '*',
    },
    //mode: 'cors',
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
      tableData.set(queryResJSON); //passing backend response to frontend "Store"
      //& we are overwriting the "Store" with set()
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
    id="tsqlQueryText"
    name="tblQryPost"
    cols="133"
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
  <p style="text-align:center; color: var(--element6)">
    {saveToCSVcreatePopResponse["response1 from saveToCSVcreatePop"]}
  </p>
  <p style="text-align:center; color: var(--element6)">
    {saveToCSVcreatePopResponse["response2 from saveToCSVcreatePop"]}
  </p>
{/if}

{#if saveToXLSXresponse !== undefined}
  <p style="text-align:center; color: var(--element6)">
    {saveToXLSXresponse["response from saveToXLSX"]}
  </p>
{/if}

<V_InventoryMasterQueryResultsTable />
