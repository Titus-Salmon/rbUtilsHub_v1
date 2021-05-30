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
  let allStoresStocked = [];
  let allStores_NOTstocked = [];

  let sfRsINDstocked = [];
  let sfRsIND_NOTstocked = [];
  let sfRsSMstocked = [];
  let sfRsSM_NOTstocked = [];
  let sfRsMTstocked = [];
  let sfRsMT_NOTstocked = [];
  let sfRsSHstocked = [];
  let sfRsSH_NOTstocked = [];
  let sfRsGLstocked = [];
  let sfRsGL_NOTstocked = [];

  let stockFilterResults = []; //clear stockFilterResults from previous search
  // console.log('calcResStockFilterUPC says: stockFilterResults from router.post level===>', stockFilterResults)

  let stockFilterResultsSplitParsedArr = [];

  let stockFilterResultsForCSV = [];
  let stockFilterResultsForCSVreview = []; //this is for holding data to generate your review excel sheet for Andrea & Brad
  // console.log('calcResStockFilterUPC says: stockFilterResultsForCSV from router.post level===>', stockFilterResultsForCSV)
  let csvContainer = [];
  // console.log('calcResStockFilterUPC says: csvContainer from router.post level===>', csvContainer)

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

  // let storeNameArr = ['Indiana', 'Saint Matthews', 'Middletown', 'Springhurst', 'Gardiner Lane']
  let storeNumberArr = ["IN", "SM", "MT", "SPR", "GL"];
  let storeAbbrevArr = ["IND", "SM", "MT", "SH", "GL"];

  let saniRegex1 = /(\[)|(\])/g;
  let saniRegex2 = /(?<=},),+(?={)/g; //for some reason, we sometimes get the following format for stockFilterResultsToStringPreSani:
  // {},,{} so we need to convert that to {},{}
  let saniRegex3 = /(,$)/g; //for some reason, we sometimes get the following format for stockFilterResultsToStringPreSani:
  // {}, so we need to convert that to {}; $ = end of string anchor (^ = beginning of string anchor)
  let saniRegex4 = /(^,)/g; //if a store doesn't carry all items in set, we get the following format for stockFilterResultsToStringPreSani:
  // ,{} so we need to convert that to {}; $ = end of string anchor (^ = beginning of string anchor)

  /* X(?=Y) 	Positive lookahead 	X if followed by Y
   * (?<=Y)X 	Positive lookbehind 	X if after Y
   * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
  let splitRegex1 = /(?<=}),(?={)/g;
  let splitRegex2 = /(?<=}),,(?={)/g; //for some reason, we sometimes get the following format for stockFilterResultsToStringPreSani:
  // {},,{}, so we need to convert that to {},{}

  function showStockFilterResults(rows) {
    let nhcrtRows = rows;

    for (let i = 0; i < nhcrtRows.length; i++) {
      for (let j = 0; j < storeNumberArr.length; j++) {
        let storeNumber = storeNumberArr[j];
        let storeAbbrev = storeAbbrevArr[j];

        function stockFilter(storeNumber) {
          let rsltsObj = {};
          rsltsObj["ri_t0d"] = i;
          rsltsObj[`${storeNumber}_UPCs`] = nhcrtRows[i]["inv_ScanCode"];

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
