const mysql = require("mysql");
import queryResArrCache from "../../../nodeCacheStuff/cache1";

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
  let GL_results = [];
  let IN_results = [];
  let MT_results = [];
  let SPR_results = [];
  let SM_results = [];
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

  let storeNumberArr = ["GL", "IN", "MT", "SPR", "SM"];

  function stockFilter(rows) {
    for (let i = 0; i < rows.length; i++) {
      let rsltsObj = {};
      for (let j = 0; j < storeNumberArr.length; j++) {
        if (storeNumberArr[j] == rows[i]["sto_number"]) {
          if (
            rows[i]["inv_lastreceived"] > oneYearAgo ||
            rows[i]["inv_lastsold"] > oneYearAgo ||
            rows[i]["inv_onhand"] > 0 ||
            rows[i]["inv_onorder"] > 0 ||
            rows[i]["inv_intransit"] > 0
          ) {
            // rsltsObj["inv_ScanCode"] = rows[i]["inv_ScanCode"];
            rsltsObj["stocked"] = rows[i]["inv_ScanCode"];
            if (rows[i]["sto_number"] == "GL") {
              GL_results.push(rsltsObj);
            }
            if (rows[i]["sto_number"] == "IN") {
              IN_results.push(rsltsObj);
            }
            if (rows[i]["sto_number"] == "MT") {
              MT_results.push(rsltsObj);
            }
            if (rows[i]["sto_number"] == "SM") {
              SM_results.push(rsltsObj);
            }
            if (rows[i]["sto_number"] == "SPR") {
              SPR_results.push(rsltsObj);
            }
          } else {
            // rsltsObj["inv_ScanCode"] = rows[i]["inv_ScanCode"];
            rsltsObj["stocked"] = "";
            if (rows[i]["sto_number"] == "GL") {
              GL_results.push(rsltsObj);
            }
            if (rows[i]["sto_number"] == "IN") {
              IN_results.push(rsltsObj);
            }
            if (rows[i]["sto_number"] == "MT") {
              MT_results.push(rsltsObj);
            }
            if (rows[i]["sto_number"] == "SM") {
              SM_results.push(rsltsObj);
            }
            if (rows[i]["sto_number"] == "SPR") {
              SPR_results.push(rsltsObj);
            }
          }
        }
      }
    }

    for (let k = 0; k < GL_results.length; k++) {
      //all store results arrays should be the same length, so it doesn't matter which one we use here
      //ALSO, they should all have the same order of UPCs, so we don't need to worry about that, since
      //we want the UPCs to remain in their original order, as they have been ordered by SPINS
      let allStoresRsObj = {};
      allStoresRsObj["#"] = k;
      // allStoresRsObj["GL_inv_ScanCode"] = GL_results[k]["inv_ScanCode"];
      allStoresRsObj["GL_stocked"] = GL_results[k]["stocked"];
      // allStoresRsObj["IN_inv_ScanCode"] = IN_results[k]["inv_ScanCode"];
      allStoresRsObj["IN_stocked"] = IN_results[k]["stocked"];
      // allStoresRsObj["MT_inv_ScanCode"] = MT_results[k]["inv_ScanCode"];
      allStoresRsObj["MT_stocked"] = MT_results[k]["stocked"];
      // allStoresRsObj["SM_inv_ScanCode"] = SM_results[k]["inv_ScanCode"];
      allStoresRsObj["SM_stocked"] = SM_results[k]["stocked"];
      // allStoresRsObj["SPR_inv_ScanCode"] = SPR_results[k]["inv_ScanCode"];
      allStoresRsObj["SPR_stocked"] = SPR_results[k]["stocked"];

      allStoresResults.push(allStoresRsObj);
    }
  }

  function queryNhcrtTable() {
    connection.query(
      `SELECT * FROM ${tableName}`,
      function (err, rows, fields) {
        if (err) throw err;
        stockFilter(rows);
        queryResArrCache.set("queryResArrCache_key", allStoresResults);
        res.json({
          allStoresResults: allStoresResults,
        });
      }
    );
  }

  queryNhcrtTable();
}
