<script>
import paginData from "../../stores/pagination/st_pagination1";
import tableData from "../../stores/dynamicTables/tableData1";
let mySqlQueryText;
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
</script>

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
