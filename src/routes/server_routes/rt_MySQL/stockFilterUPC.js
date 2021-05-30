const mysql = require("mysql");
import cacheMainStockFilter from "../../../nodeCacheStuff/cache1";

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

export async function post(req, res, next) {
  res.setHeader("Content-Type", "application/json");

  let tableName = req.body.tableName;

  let stockFilterResultsCacheChecker = cacheMainStockFilter.get(
    "stockFilterResultsCache_key"
  );
  if (stockFilterResultsCacheChecker !== undefined) {
    //clear stockFilterResultsCache_key if it exists
    cacheMainStockFilter.del("stockFilterResultsCache_key");
  }

  let allStoresResults = [];

  let todaysDateRaw = new Date();
  let todaysDateRaw_iso = todaysDateRaw.toISOString();
  let todaysDateRaw_split = todaysDateRaw_iso.split("T");
  let todaysDate = todaysDateRaw_split[0];
  console.log(`todaysDate==> ${todaysDate}`);

  let oneYearAgoRaw_pre = todaysDateRaw;
  oneYearAgoRaw_pre.setFullYear(todaysDateRaw.getFullYear() - 1);

  let oneYearAgoRaw_iso = oneYearAgoRaw_pre.toISOString();
  let oneYearAgoRaw_split = oneYearAgoRaw_iso.split("T");
  let oneYearAgo = oneYearAgoRaw_split[0];
  console.log(`oneYearAgo==> ${oneYearAgo}`);

  let storeNumberArr = ["IN", "SM", "MT", "SPR", "GL"];

  function showStockFilterResults(rows) {
    let nhcrtRows = rows;

    for (let i = 0; i < nhcrtRows.length; i++) {
      for (let j = 0; j < storeNumberArr.length; j++) {
        let storeNumber = storeNumberArr[j];

        function stockFilter(storeNumber) {
          let rsltsObj = {};
          rsltsObj["ri_t0d"] = i;
          //if (nhcrtRows[i]["sto_number"] == storeNumber) {
          // let rsltsObj = {};
          // rsltsObj["ri_t0d"] = i;
          //rsltsObj[`${storeNumber}_UPCs`] = nhcrtRows[i]["inv_ScanCode"];

          if (
            nhcrtRows[i]["inv_lastreceived"] > oneYearAgo ||
            nhcrtRows[i]["inv_lastsold"] > oneYearAgo ||
            nhcrtRows[i]["inv_onhand"] > 0
          ) {
            rsltsObj[`${storeNumber}_stocked`] = nhcrtRows[i]["inv_ScanCode"];
            //v//try to push all results into single array for single column heading
            allStoresResults.push(rsltsObj);
            //^//try to push all results into single array for single column heading
          } else {
            rsltsObj[`${storeNumber}_NOTstocked`] =
              nhcrtRows[i]["inv_ScanCode"];
            //v//try to push all results into single array for single column heading
            allStoresResults.push(rsltsObj);
            //^//try to push all results into single array for single column heading
          }
          //}
        }
        stockFilter(storeNumber);
      }
    }
  }

  function queryNhcrtTable() {
    connection.query(
      `SELECT * FROM ${tableName}`,
      function (err, rows, fields) {
        if (err) throw err;
        showStockFilterResults(rows);

        res.json({
          // sfResRows: stockFilterResultsSplit,
          // loadedSqlTbl: loadedSqlTbl,
          // sfRsINDstocked: sfRsINDstocked,
          // sfRsIND_NOTstocked: sfRsIND_NOTstocked,
          // sfRsSMstocked: sfRsSMstocked,
          // sfRsSM_NOTstocked: sfRsSM_NOTstocked,
          // sfRsMTstocked: sfRsMTstocked,
          // sfRsMT_NOTstocked: sfRsMT_NOTstocked,
          // sfRsSHstocked: sfRsSHstocked,
          // sfRsSH_NOTstocked: sfRsSH_NOTstocked,
          // sfRsGLstocked: sfRsGLstocked,
          // sfRsGL_NOTstocked: sfRsGL_NOTstocked,
          //stockFilterResultsSplitParsedArr: stockFilterResultsSplitParsedArr,
          allStoresResults: allStoresResults,
        });
      }
    );
  }

  queryNhcrtTable();
}
