<script>
import { onMount } from "svelte";
import V_InventoryMasterQueryResultsTable from "../components/dynamicTalbes/v_InventoryMasterQueryResults.svelte";
import tableData from "../components/dynamicTalbes/tableStores/tableData1.js";

let tsqlQueryText;

function vInvMasterQuery() {
  fetch("v_InventoryMasterQuery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      //'Access-Control-Allow-Origin': '*',
    },
    //mode: 'cors',
    body: JSON.stringify({
      data: tsqlQueryText,
      // data: `SELECT INV_PK, INV_CPK, INV_ScanCode, ORD_SupplierStockNumber, INV_Name,
      //   INV_Size, INV_ReceiptAlias, inv_default, convert(varchar(10),
      //   POS_TimeStamp, 120), INV_DateCreated, INV_EMP_FK_CreatedBy,
      //   ord_quantityinorderunit, oup_name, sto_number, dpt_name, dpt_number,
      //   SIB_IdealMargin, ven_companyname, convert(varchar(10), inv_lastreceived,
      //   120), convert(varchar(10), inv_lastsold, 120), inv_lastcost,
      //   SIB_BasePrice, inv_onhand, inv_onorder, inv_intransit, inv_memo,
      //   PI1_Description, PI2_Description, PI3_Description, PI4_Description,
      //   INV_PowerField1, INV_PowerField2, INV_PowerField3, INV_PowerField4 FROM
      //   catapult.ecrs.v_InventoryMaster WHERE trim(ven_companyname) IN
      //   ('EDI-ALOE') AND trim(dpt_number) != '999999' ORDER BY PI1_Description,
      //   PI2_Description`,
    }),
  })
    .then((responseFromBackend_t0d) => responseFromBackend_t0d.json())
    //^//not certain how this works, but the best I can describe for now is as follows:
    //[1] the "responseFromBackend_t0d" argument represents the result of the previous fetch()
    //[2] this result must then be converted to JSON via the json() method on the frontend, even though it was already sent
    //from the backend as JSON

    .then((responseFromBackend_t0d_convertedToJSON) => {
      console.log(
        `JSON.stringify(responseFromBackend_t0d_convertedToJSON[0])==> ${JSON.stringify(
          responseFromBackend_t0d_convertedToJSON[0]
        )}`
      );
      tableData.set(responseFromBackend_t0d_convertedToJSON); //passing backend response to frontend "Store"
      //& we are overwriting the "Store" with set()
    });
  //^//[3] then, the results from the 1st then() are passed as "responseFromBackend_t0d_convertedToJSON",
  //and at that point we can use this JSON object to do whatever with, such as stringify it, or
  //display it in a table on the frontend
}
</script>

<style>
</style>

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

<V_InventoryMasterQueryResultsTable />
