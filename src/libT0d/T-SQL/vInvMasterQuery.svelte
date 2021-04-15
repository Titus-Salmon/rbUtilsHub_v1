<script>
import paginData from "../../stores/pagination/st_pagination1";
import tableData from "../../stores/dynamicTables/tableData1";
let tsqlQueryText;
let queryText = `
SELECT 
inv_ScanCode, ord_supplierstocknumber, inv_name, inv_size, inv_receiptalias, inv_datecreated, inv_default, ord_quantityinorderunit, oup_name, 
sto_number, brd_name, dpt_name, dpt_number, wgt_name, sib_idealMargin, ven_companyname, ven_code, asc_scancode, asc_receiptalias, asc_quantity, 
convert(varchar(10), inv_lastreceived, 120), convert(varchar(10), inv_lastsold, 120), inv_lastcost, sib_baseprice, inv_onhand, inv_onorder, 
inv_intransit, inv_memo, pi1_Description, pi2_Description, pi3_Description, pi4_Description, inv_powerfield1, inv_powerfield2, inv_powerfield3, 
inv_powerfield4 
FROM
catapult.ecrs.v_InventoryMaster 
WHERE trim(ven_companyname) IN ('EDI-ALOE')
AND trim(dpt_number) != '999999' ORDER BY dpt_name, pi1_Description, pi2_Description
`;

let actlMargRangeVal;

function vInvMasterQuery() {
  fetch("server_routes/rt_T-SQL/v_InventoryMasterQuery", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: tsqlQueryText.value,
      actlMargRangeVal: actlMargRangeVal.value,
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
</script>

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

<div style="text-align:center">
  <label for="actlMargRange">Enter Range for Actual Margin</label>
</div>
<div style="text-align:center">
  <input
    type="text"
    id="actlMargRange"
    name="actlMargRange"
    bind:this="{actlMargRangeVal}" />
</div>

<button style="display:block; margin: 0 auto 1rem" on:click="{vInvMasterQuery}"
  >vInvMasterQuery</button>
