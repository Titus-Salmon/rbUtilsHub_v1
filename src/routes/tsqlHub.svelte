<script>
import { onMount } from "svelte";
import V_InventoryMasterQueryResultsTable from "../components/dynamicTalbes/v_InventoryMasterQueryResults.svelte";
import tableData from "../components/dynamicTalbes/tableStores/tableData1.js";
import DkMdBtn from "../components/DkMdBtn.svelte"; //t0d

let tsqlQueryText;
let saveToCSVfilename;
let saveToCSVresponse;

function vInvMasterQuery() {
  fetch("v_InventoryMasterQuery", {
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
      console.log(
        `JSON.stringify(queryResJSON[0])==> ${JSON.stringify(queryResJSON[0])}`
      );
      tableData.set(queryResJSON); //passing backend response to frontend "Store"
      //& we are overwriting the "Store" with set()
      // queryResJSONArr.push(queryResJSON); //push table query results to array outside of this function, so the results
      //can be used by saveToCSV()
    });
  //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
  //and at that point we can use this JSON object to do whatever with, such as stringify it, or
  //display it in a table on the frontend
}

function saveToCSV() {
  fetch("saveToCSV", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: saveToCSVfilename.value,
    }),
  })
    .then((saveToCSVresult) => saveToCSVresult.json())
    .then((saveToCSVresultJSON) => {
      console.log(
        // `JSON.stringify(saveToCSVresultJSON[0])==> ${JSON.stringify(
        //   saveToCSVresultJSON[0]
        // )}`
        `JSON.stringify(saveToCSVresultJSON)==> ${JSON.stringify(
          saveToCSVresultJSON
        )}`
      );
      saveToCSVresponse = saveToCSVresultJSON;
    });
}
</script>

<style>
</style>

<DkMdBtn>MODE</DkMdBtn>

<textarea
  id="tsqlQueryText"
  name="tblQryPost"
  cols="30"
  rows="1"
  wrap="soft"
  bind:this="{tsqlQueryText}">
  SELECT INV_PK, INV_CPK, INV_ScanCode, ORD_SupplierStockNumber, INV_Name,
  INV_Size, INV_ReceiptAlias, inv_default, convert(varchar(10), POS_TimeStamp,
  120), INV_DateCreated, INV_EMP_FK_CreatedBy, ord_quantityinorderunit,
  oup_name, sto_number, dpt_name, dpt_number, SIB_IdealMargin, ven_companyname,
  convert(varchar(10), inv_lastreceived, 120), convert(varchar(10),
  inv_lastsold, 120), inv_lastcost, SIB_BasePrice, inv_onhand, inv_onorder,
  inv_intransit, inv_memo, PI1_Description, PI2_Description, PI3_Description,
  PI4_Description, INV_PowerField1, INV_PowerField2, INV_PowerField3,
  INV_PowerField4 FROM catapult.ecrs.v_InventoryMaster WHERE
  trim(ven_companyname) IN ('EDI-ALOE') AND trim(dpt_number) != '999999' ORDER
  BY PI1_Description, PI2_Description
</textarea>

<button on:click="{vInvMasterQuery}">vInvMasterQuery</button>

<label for="saveToCSV">File Name</label>
<input
  type="text"
  id="saveToCSV"
  name="saveToCSV"
  bind:this="{saveToCSVfilename}" />
<button on:click="{saveToCSV}">saveToCSV</button>

{#if saveToCSVresponse !== undefined}
  <p>
    {Object.values(saveToCSVresponse)}
  </p>
{/if}

<V_InventoryMasterQueryResultsTable />
