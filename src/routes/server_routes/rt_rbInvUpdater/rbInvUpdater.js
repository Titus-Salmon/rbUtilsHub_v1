const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

const odbc = require("odbc");
const DSN = process.env.ODBC_CONN_STRING;

const fs = require("fs");

export async function post(req, res, next) {
  console.log(`JSON.stringify(req.body)==> ${JSON.stringify(req.body)}`);
  let rb_inventoryQuery = req.body.initialQueryText;
  let rb_invUPCs = [];

  let catapultResArr = [];

  let createNhcrtRbInvTableQuery = `
  DROP TABLE IF EXISTS nhcrtRbInvQuery;
  CREATE TABLE nhcrtRbInvQuery (ri_t0d int NOT NULL AUTO_INCREMENT, INV_ScanCode VARCHAR(255), sto_number VARCHAR(255), 
  inv_lastreceived VARCHAR(255), inv_lastsold VARCHAR(255), inv_onhand VARCHAR(255), inv_onorder VARCHAR(255), 
  inv_intransit VARCHAR(255), PRIMARY KEY (ri_t0d));
  `;

  let populateNhcrtRbInvTableQuery = `
  LOAD DATA LOCAL INFILE './static/csv/rb_inv_nhcrt.csv' INTO TABLE nhcrtRbInv FIELDS TERMINATED BY ',' 
  ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;`; //"IGNORE 1 LINES" skips the 1st row of the csv (which is the column name line)

  async function rb_inventory_query() {
    connection
      .query(rb_inventoryQuery, function (err, rows, fields) {
        if (err) throw err;
        for (let i = 0; i < rows.length; i++) {
          rb_invUPCs.push(`${rows[i]["inv_upc"]}`);
        }
      })
      .on("end", function () {
        queryCatapultWithRbInvUPCs();
      });
  }

  async function csvGenerator() {
    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const { Parser } = require("json2csv");

    const fields = [
      "ri_t0d",
      "INV_ScanCode",
      "sto_number",
      "inv_lastreceived",
      "inv_lastsold",
      "inv_onhand",
      "inv_onorder",
      "inv_intransit",
    ];

    const opts = {
      fields,
    };

    try {
      console.log("catapultResArr[0] from json2csv======>>", catapultResArr[0]);
      const parser = new Parser(opts);
      const csv = parser.parse(catapultResArr);
      console.log("csv.length=====>>", csv.length);
      fs.writeFile(
        `${process.cwd()}/static/csv/rb_inv_nhcrt.csv`,
        csv,
        function (err) {
          if (err) throw err;
          console.log("~~~~~>>rb_inv_nhcrt.csvsaved<<~~~~~");
        }
      );
    } catch (err) {
      console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////
  }

  async function queryCatapultWithRbInvUPCs() {
    let rb_invUPCsToString = rb_invUPCs
      .map((arrayItem) => `'${arrayItem}'`)
      .join(",");
    let startingindex = 0;
    let endingindex = rb_invUPCsToString.length;
    rb_invUPCsToString = rb_invUPCsToString.slice(startingindex, endingindex);
    let rb_invUPCsToStringTest1 = rb_invUPCsToString.substring(0, 48);
    let rb_invUPCsToStringTest2 = rb_invUPCsToString.substring(
      rb_invUPCsToString.length - 48,
      rb_invUPCsToString.length
    );
    console.log(`rb_invUPCsToStringTest1==> ${rb_invUPCsToStringTest1}`);
    console.log(`rb_invUPCsToStringTest2==> ${rb_invUPCsToStringTest2}`);

    let catapultDbQuery = `
  SELECT 
  INV_ScanCode, sto_number, convert(varchar(10), inv_lastreceived, 120), convert(varchar(10), inv_lastsold, 120),
  inv_onhand, inv_onorder, inv_intransit 
  FROM catapult.ecrs.v_InventoryMaster WHERE trim(INV_ScanCode) 
  IN (${rb_invUPCsToString.trim()})
  `;

    async function odbcPart(catapultDbQuery) {
      odbc.connect(DSN, (error, connection) => {
        connection.query(`${catapultDbQuery}`, (error, result) => {
          let catapultDbQueryTest = catapultDbQuery.substring(0, 488);
          console.log(
            `catapultDbQueryTest from odbcPart==> ${catapultDbQueryTest}`
          );
          function catapultResults(result) {
            console.log(
              `result.length from catapultResults(result)~~~> ${result.length}`
            );
            for (let i = 0; i < result.length; i++) {
              let catapultResObj = {};
              catapultResObj["ri_t0d"] = i + 1;
              if (typeof result[i]["INV_ScanCode"] == "string") {
                catapultResObj["INV_ScanCode"] =
                  result[i]["INV_ScanCode"].trim();
              } else {
                catapultResObj["INV_ScanCode"] = result[i]["INV_ScanCode"];
              }
              if (typeof result[i]["sto_number"] == "string") {
                catapultResObj["sto_number"] = result[i]["sto_number"].trim();
              } else {
                catapultResObj["sto_number"] = result[i]["sto_number"];
              }
              catapultResObj["inv_lastreceived"] =
                result[i]["inv_lastreceived"];
              catapultResObj["inv_lastsold"] = result[i]["inv_lastsold"];
              catapultResObj["inv_onhand"] = result[i]["inv_onhand"];
              catapultResObj["inv_onorder"] = result[i]["inv_onorder"];
              catapultResObj["inv_intransit"] = result[i]["inv_intransit"];

              catapultResArr.push(catapultResObj);
            }
            await csvGenerator();
          }
          if (error) {
            console.error(error);
          }
          catapultResults(result);
        });
      });
    }

    await odbcPart(catapultDbQuery);
    // .then(csvGenerator())
    // .then(createNhcrtRbInvTable());
  }

  async function createNhcrtRbInvTable() {
    connection
      .query(createNhcrtRbInvTableQuery, function (error, response) {
        console.log(error || response);
      })
      .on("end", function () {
        populateNhcrtRbInvTable();
      });
  }

  async function populateNhcrtRbInvTable() {
    connection
      .query(populateNhcrtRbInvTableQuery, function (error, response) {
        console.log(error || response);
      })
      .on("end", function () {
        calcResRbInvUpdater();
      });
  }

  async function calcResRbInvUpdater() {
    let wishlistIgnore = [];
    let wishlistUpdate = [];

    let srcRsINDstocked = [];
    let srcRsIND_NOTstocked = [];
    let srcRsSMstocked = [];
    let srcRsSM_NOTstocked = [];
    let srcRsMTstocked = [];
    let srcRsMT_NOTstocked = [];
    let srcRsSHstocked = [];
    let srcRsSH_NOTstocked = [];
    let srcRsGLstocked = [];
    let srcRsGL_NOTstocked = [];

    // let searchResults = []; //clear searchResults from previous search
    // let searchResultsSplitParsedArr = [];
    // let searchResultsForCSV = [];
    // let searchResultsForCSVreview = []; //this is for holding data to generate your review excel sheet for Andrea & Brad
    // let csvContainer = [];

    let todaysDateRaw1 = new Date();
    let todaysDateRaw1_iso = todaysDateRaw1.toISOString();
    let todaysDateRaw1_split = todaysDateRaw1_iso.split("T");
    let todaysDate1 = todaysDateRaw1_split[0];
    console.log(`todaysDate1==> ${todaysDate1}`);

    //v//////////one year ago///////////////////////////////////////
    let oneYearAgoRaw_pre = todaysDateRaw1;
    oneYearAgoRaw_pre.setFullYear(todaysDateRaw1.getFullYear() - 1);

    let oneYearAgoRaw_iso = oneYearAgoRaw_pre.toISOString();
    let oneYearAgoRaw_split = oneYearAgoRaw_iso.split("T");
    let oneYearAgo = oneYearAgoRaw_split[0];
    console.log(`oneYearAgo==> ${oneYearAgo}`);
    //^//////////one year ago///////////////////////////////////////

    //v//////////one month ago///////////////////////////////////////
    let today = new Date();
    let todayInMilliseconds = today.getTime();
    let oneMonthAgoInMilliseconds = todayInMilliseconds - 2592000000;
    let todayISO = new Date(today).toISOString();
    console.log(`todayISO==> ${todayISO}`);
    let oneMonthAgoISO = new Date(oneMonthAgoInMilliseconds).toISOString();
    console.log(`oneMonthAgoISO==> ${oneMonthAgoISO}`);
    let oneMonthAgoISO_split = oneMonthAgoISO.split("T");
    let oneMonthAgo = oneMonthAgoISO_split[0];
    console.log(`oneMontghAgo==> ${oneMonthAgo}`);
    //^//////////one month ago///////////////////////////////////////

    let storeNumberArr = ["IN", "SM", "MT", "SPR", "GL"];
    let storeAbbrevArr = ["IND", "SM", "MT", "SH", "GL"];

    let saniRegex1 = /(\[)|(\])/g;
    let saniRegex2 = /"/g;
    let saniRegex3 = /\s/g;

    function showSearchResults(rows) {
      console.log(`rows.length from showSearchResults==> ${rows.length}`);

      let nhcrtRows = rows[0];
      let wishlistRows = rows[1];

      console.log(`nhcrtRows[0]==> ${nhcrtRows[0]}`);
      console.log(
        `JSON.stringify(nhcrtRows[0])==> ${JSON.stringify(nhcrtRows[0])}`
      );
      console.log(`wishlistRows[0]==> ${wishlistRows[0]}`);
      console.log(
        `JSON.stringify(wishlistRows[0])==> ${JSON.stringify(wishlistRows[0])}`
      );

      // let wishlistCheckerObj = {}

      for (let k = 0; k < wishlistRows.length; k++) {
        let wishlistCheckerObj = {};
        if (wishlistRows[k]["rb_approved"] < oneMonthAgo) {
          //if the Date value for rb_approved is less than the Date value for one month ago
          //(i.e., if an item has been approved longer than one month ago), WE WILL UPDATE THAT ITEM using the new sign filter, since we've
          //presumably had enough time for that item to have a lastSold or lastReceived date.
          wishlistCheckerObj["upc"] = wishlistRows[k]["upc_code"];
          wishlistCheckerObj["dateApproved"] = wishlistRows[k]["rb_approved"];
          wishlistUpdate.push(wishlistCheckerObj);
        } else {
          //otherwise, we'll ignore it
          wishlistCheckerObj["upc"] = wishlistRows[k]["upc_code"];
          wishlistCheckerObj["dateApproved"] = wishlistRows[k]["rb_approved"];
          wishlistIgnore.push(wishlistCheckerObj);
        }
      }

      for (let m = 0; m < wishlistIgnore.length; m++) {
        //just a check to make sure the right items (approved within the last month) are ignored
        if (wishlistIgnore[m]["dateApproved"] !== null)
          console.log(
            `JSON.stringify(wishlistIgnore[${m})]==> ${JSON.stringify(
              wishlistIgnore[m]
            )}`
          );
      }

      for (let i = 0; i < nhcrtRows.length; i++) {
        for (let j = 0; j < storeNumberArr.length; j++) {
          let storeNumber = storeNumberArr[j];
          let storeAbbrev = storeAbbrevArr[j];

          function calcRes(storeNumber, storeAbbrev) {
            if (nhcrtRows[i]["sto_number"] == storeNumber) {
              if (
                nhcrtRows[i]["inv_lastreceived"] > oneYearAgo ||
                nhcrtRows[i]["inv_lastsold"] > oneYearAgo ||
                nhcrtRows[i]["inv_onhand"] > 0
              ) {
                if (nhcrtRows[i]["sto_number"] == "IN") {
                  srcRsINDstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
                if (nhcrtRows[i]["sto_number"] == "SM") {
                  srcRsSMstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
                if (nhcrtRows[i]["sto_number"] == "MT") {
                  srcRsMTstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
                if (nhcrtRows[i]["sto_number"] == "SPR") {
                  srcRsSHstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
                if (nhcrtRows[i]["sto_number"] == "GL") {
                  srcRsGLstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
              } else {
                if (nhcrtRows[i]["sto_number"] == "IN") {
                  srcRsIND_NOTstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
                if (nhcrtRows[i]["sto_number"] == "SM") {
                  srcRsSM_NOTstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
                if (nhcrtRows[i]["sto_number"] == "MT") {
                  srcRsMT_NOTstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
                if (nhcrtRows[i]["sto_number"] == "SPR") {
                  srcRsSH_NOTstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
                if (nhcrtRows[i]["sto_number"] == "GL") {
                  srcRsGL_NOTstocked.push(`${nhcrtRows[i]["INV_ScanCode"]}`);
                }
              }
            }
          }
          calcRes(storeNumber, storeAbbrev);
        }
      }

      console.log(
        `srcRsINDstocked.length before wishlist filtering==> ${srcRsINDstocked.length}`
      );
      console.log(
        `srcRsIND_NOTstocked.length before wishlist filtering==> ${srcRsIND_NOTstocked.length}`
      );
      console.log(
        `srcRsSMstocked.length before wishlist filtering==> ${srcRsSMstocked.length}`
      );
      console.log(
        `srcRsSM_NOTstocked.length before wishlist filtering==> ${srcRsSM_NOTstocked.length}`
      );
      console.log(
        `srcRsMTstocked.length before wishlist filtering==> ${srcRsMTstocked.length}`
      );
      console.log(
        `srcRsMT_NOTstocked.length before wishlist filtering==> ${srcRsMT_NOTstocked.length}`
      );
      console.log(
        `srcRsSHstocked.length before wishlist filtering==> ${srcRsSHstocked.length}`
      );
      console.log(
        `srcRsSH_NOTstocked.length before wishlist filtering==> ${srcRsSH_NOTstocked.length}`
      );
      console.log(
        `srcRsGLstocked.length before wishlist filtering==> ${srcRsGLstocked.length}`
      );
      console.log(
        `srcRsGL_NOTstocked.length before wishlist filtering==> ${srcRsGL_NOTstocked.length}`
      );

      for (let m = 0; m < wishlistIgnore.length; m++) {
        //remove recent wishlist items from "stocked" and "not stocked" arrays for each store
        //(removing anything approved within the last month)
        for (let a = 0; a < srcRsINDstocked.length; a++) {
          if (wishlistIgnore[m]["upc"] == srcRsINDstocked[a]) {
            console.log(
              `${srcRsINDstocked[a]} removed from update, since its wishlist approved date is ${wishlistIgnore[m]["dateApproved"]}`
            );
            srcRsINDstocked.splice(a, 1);
          }
        }
        for (let b = 0; b < srcRsIND_NOTstocked.length; b++) {
          if (wishlistIgnore[m]["upc"] == srcRsIND_NOTstocked[b]) {
            srcRsIND_NOTstocked.splice(b, 1);
          }
        }
        for (let c = 0; c < srcRsSMstocked.length; c++) {
          if (wishlistIgnore[m]["upc"] == srcRsSMstocked[c]) {
            srcRsSMstocked.splice(c, 1);
          }
        }
        for (let d = 0; d < srcRsSM_NOTstocked.length; d++) {
          if (wishlistIgnore[m]["upc"] == srcRsSM_NOTstocked[d]) {
            srcRsSM_NOTstocked.splice(d, 1);
          }
        }
        for (let e = 0; e < srcRsMTstocked.length; e++) {
          if (wishlistIgnore[m]["upc"] == srcRsMTstocked[e]) {
            srcRsMTstocked.splice(e, 1);
          }
        }
        for (let f = 0; f < srcRsMT_NOTstocked.length; f++) {
          if (wishlistIgnore[m]["upc"] == srcRsMT_NOTstocked[f]) {
            srcRsMT_NOTstocked.splice(f, 1);
          }
        }
        for (let g = 0; g < srcRsSHstocked.length; g++) {
          if (wishlistIgnore[m]["upc"] == srcRsSHstocked[g]) {
            srcRsSHstocked.splice(g, 1);
          }
        }
        for (let h = 0; h < srcRsSH_NOTstocked.length; h++) {
          if (wishlistIgnore[m]["upc"] == srcRsSH_NOTstocked[h]) {
            srcRsSH_NOTstocked.splice(h, 1);
          }
        }
        for (let p = 0; p < srcRsGLstocked.length; p++) {
          if (wishlistIgnore[m]["upc"] == srcRsGLstocked[p]) {
            srcRsGLstocked.splice(p, 1);
          }
        }
        for (let q = 0; q < srcRsGL_NOTstocked.length; q++) {
          if (wishlistIgnore[m]["upc"] == srcRsGL_NOTstocked[q]) {
            srcRsGL_NOTstocked.splice(q, 1);
          }
        }
      }

      console.log(
        `srcRsINDstocked.length after wishlist filtering==> ${srcRsINDstocked.length}`
      );
      console.log(
        `srcRsIND_NOTstocked.length after wishlist filtering==> ${srcRsIND_NOTstocked.length}`
      );
      console.log(
        `srcRsSMstocked.length after wishlist filtering==> ${srcRsSMstocked.length}`
      );
      console.log(
        `srcRsSM_NOTstocked.length after wishlist filtering==> ${srcRsSM_NOTstocked.length}`
      );
      console.log(
        `srcRsMTstocked.length after wishlist filtering==> ${srcRsMTstocked.length}`
      );
      console.log(
        `srcRsMT_NOTstocked.length after wishlist filtering==> ${srcRsMT_NOTstocked.length}`
      );
      console.log(
        `srcRsSHstocked.length after wishlist filtering==> ${srcRsSHstocked.length}`
      );
      console.log(
        `srcRsSH_NOTstocked.length after wishlist filtering==> ${srcRsSH_NOTstocked.length}`
      );
      console.log(
        `srcRsGLstocked.length after wishlist filtering==> ${srcRsGLstocked.length}`
      );
      console.log(
        `srcRsGL_NOTstocked.length after wishlist filtering==> ${srcRsGL_NOTstocked.length}`
      );

      console.log(`srcRsINDstocked[0]==> ${srcRsINDstocked[0]}`);
      console.log(`typeof srcRsINDstocked[0]==> ${typeof srcRsINDstocked[0]}`);

      srcRsINDstockedSani = JSON.stringify(srcRsINDstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
      console.log(
        `typeof srcRsINDstockedSani==> ${typeof srcRsINDstockedSani}`
      );
      srcRsIND_NOTstockedSani = JSON.stringify(srcRsIND_NOTstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
      srcRsSMstockedSani = JSON.stringify(srcRsSMstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
      srcRsSM_NOTstockedSani = JSON.stringify(srcRsSM_NOTstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
      srcRsMTstockedSani = JSON.stringify(srcRsMTstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
      srcRsMT_NOTstockedSani = JSON.stringify(srcRsMT_NOTstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
      srcRsSHstockedSani = JSON.stringify(srcRsSHstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
      srcRsSH_NOTstockedSani = JSON.stringify(srcRsSH_NOTstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
      srcRsGLstockedSani = JSON.stringify(srcRsGLstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
      srcRsGL_NOTstockedSani = JSON.stringify(srcRsGL_NOTstocked)
        .replace(saniRegex1, "")
        .replace(saniRegex2, "'")
        .replace(saniRegex3, "");
    }

    function queryNhcrtTable() {
      connection
        .query(
          `
      CREATE TABLE rb_inventory_test_old AS SELECT * FROM rb_inventory_test;
      SELECT * FROM nhcrtRbInvTable;
      SELECT * FROM rb_wishlist;`,
          function (err, rows, fields) {
            if (err) throw err;
            showSearchResults(rows);

            console.log(
              `srcRsINDstocked[0] called from queryNhcrtTable==> ${srcRsINDstocked[0]}`
            );

            connection.query(
              `
        UPDATE rb_inventory_test
        SET inv_in_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsINDstockedSani});
        
        UPDATE rb_inventory_test
        SET inv_in_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsIND_NOTstockedSani});
        
        UPDATE rb_inventory_test
        SET inv_sm_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsSMstockedSani});
        
        UPDATE rb_inventory_test
        SET inv_sm_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsSM_NOTstockedSani});
        
        UPDATE rb_inventory_test
        SET inv_mt_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsMTstockedSani});
        
        UPDATE rb_inventory_test
        SET inv_mt_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsMT_NOTstockedSani});
        
        UPDATE rb_inventory_test
        SET inv_sh_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsSHstockedSani});
        
        UPDATE rb_inventory_test
        SET inv_sh_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsSH_NOTstockedSani});
        
        UPDATE rb_inventory_test
        SET inv_gl_stock = '1'
        WHERE trim(inv_upc)
        IN (${srcRsGLstockedSani});
        
        UPDATE rb_inventory_test
        SET inv_gl_stock = '0'
        WHERE trim(inv_upc)
        IN (${srcRsGL_NOTstockedSani});`,
              function (err, rows, fields) {
                if (err) throw err;

                console.log(
                  `rows.length from nested connection.query==> ${rows.length}`
                );
                console.log(
                  `JSON.stringify(rows[0]) from nested connection.query==> ${JSON.stringify(
                    rows[0]
                  )}`
                );
                console.log(
                  `JSON.stringify(rows[1]) from nested connection.query==> ${JSON.stringify(
                    rows[1]
                  )}`
                );
                console.log(
                  `JSON.stringify(rows[2]) from nested connection.query==> ${JSON.stringify(
                    rows[2]
                  )}`
                );
                console.log(
                  `JSON.stringify(rows[3]) from nested connection.query==> ${JSON.stringify(
                    rows[3]
                  )}`
                );
                console.log(
                  `JSON.stringify(rows[4]) from nested connection.query==> ${JSON.stringify(
                    rows[4]
                  )}`
                );
                console.log(
                  `JSON.stringify(rows[5]) from nested connection.query==> ${JSON.stringify(
                    rows[5]
                  )}`
                );
                console.log(
                  `JSON.stringify(rows[6]) from nested connection.query==> ${JSON.stringify(
                    rows[6]
                  )}`
                );
                console.log(
                  `JSON.stringify(rows[7]) from nested connection.query==> ${JSON.stringify(
                    rows[7]
                  )}`
                );
                console.log(
                  `JSON.stringify(rows[8]) from nested connection.query==> ${JSON.stringify(
                    rows[8]
                  )}`
                );
                console.log(
                  `JSON.stringify(rows[9]) from nested connection.query==> ${JSON.stringify(
                    rows[9]
                  )}`
                );
              }
            );
          }
        )
        .on("end", function () {
          rbInvAudit();
        });
    }
    queryNhcrtTable();
  }

  async function rbInvAudit() {
    let rbInvJoinArr_ind = [];
    let rbInvJoinArr_sm = [];
    let rbInvJoinArr_mt = [];
    let rbInvJoinArr_sh = [];
    let rbInvJoinArr_gl = [];

    searchResults = []; //clear searchResults from previous search

    searchResultsSplitParsedArr = [];

    let saniRegex1 = /(\[)|(\])/g;
    let saniRegex2 = /""/g;

    /* X(?=Y) 	Positive lookahead 	X if followed by Y
     * (?<=Y)X 	Positive lookbehind 	X if after Y
     * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
    let splitRegex1 = /(?<=}),(?={)/g;

    function displayRbInvJoin(rows) {
      let indRows = rows[0];
      let smRows = rows[1];
      let mtRows = rows[2];
      let shRows = rows[3];
      let glRows = rows[4];

      for (let i = 0; i < indRows.length; i++) {
        let rbInvJoinObj_ind = {};
        rbInvJoinObj_ind["ri_t0dIND"] = i + 1;
        rbInvJoinObj_ind["new_inv_upcIND"] = indRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_ind["new_inv_nameIND"] = indRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_ind["new_inv_in_stockIND"] =
          indRows[i]["new_inv_in_stock"];
        // if (indRows[i]['new_inv_in_stock'] = null) {
        //   rbInvJoinObj_ind['new_inv_in_stockIND'] = 'EMPTY'
        // } else {
        //   rbInvJoinObj_ind['new_inv_in_stockIND'] = indRows[i]['new_inv_in_stock']
        // }
        rbInvJoinObj_ind["old_inv_in_stockIND"] =
          indRows[i]["old_inv_in_stock"];
        // if (indRows[i]['old_inv_in_stock'] = null) {
        //   rbInvJoinObj_ind['old_inv_in_stockIND'] == 'EMPTY'
        // } else {
        //   rbInvJoinObj_ind['old_inv_in_stockIND'] = indRows[i]['old_inv_in_stock']
        // }

        rbInvJoinArr_ind.push(rbInvJoinObj_ind);
      }

      for (let i = 0; i < smRows.length; i++) {
        let rbInvJoinObj_sm = {};
        rbInvJoinObj_sm["ri_t0dSM"] = i + 1;
        rbInvJoinObj_sm["new_inv_upcSM"] = smRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sm["new_inv_nameSM"] = smRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sm["new_inv_sm_stockSM"] = smRows[i]["new_inv_sm_stock"];
        // if (smRows[i]['new_inv_sm_stock'] = null) {
        //   rbInvJoinObj_sm['new_inv_sm_stockSM'] = 'EMPTY'
        // } else {
        //   rbInvJoinObj_sm['new_inv_sm_stockSM'] = smRows[i]['new_inv_sm_stock']
        // }
        rbInvJoinObj_sm["old_inv_sm_stockSM"] = smRows[i]["old_inv_sm_stock"];
        // if (smRows[i]['old_inv_sm_stock'] = null) {
        //   rbInvJoinObj_sm['old_inv_sm_stockSM'] = 'EMPTY'
        // } else {
        //   rbInvJoinObj_sm['old_inv_sm_stockSM'] = smRows[i]['old_inv_sm_stock']
        // }

        rbInvJoinArr_sm.push(rbInvJoinObj_sm);
      }

      for (let i = 0; i < mtRows.length; i++) {
        let rbInvJoinObj_mt = {};
        rbInvJoinObj_mt["ri_t0dMT"] = i + 1;
        rbInvJoinObj_mt["new_inv_upcMT"] = mtRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_mt["new_inv_nameMT"] = mtRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_mt["new_inv_mt_stockMT"] = mtRows[i]["new_inv_mt_stock"];
        // if (mtRows[i]['new_inv_mt_stock'] = null) {
        //   rbInvJoinObj_mt['new_inv_mt_stockMT'] = 'EMPTY'
        // } else {
        //   rbInvJoinObj_mt['new_inv_mt_stockMT'] = mtRows[i]['new_inv_mt_stock']
        // }
        rbInvJoinObj_mt["old_inv_mt_stockMT"] = mtRows[i]["old_inv_mt_stock"];
        // if (mtRows[i]['old_inv_mt_stock'] = null) {
        //   rbInvJoinObj_mt['old_inv_mt_stockMT'] = 'EMPTY'
        // } else {
        //   rbInvJoinObj_mt['old_inv_mt_stockMT'] = mtRows[i]['old_inv_mt_stock']
        // }

        rbInvJoinArr_mt.push(rbInvJoinObj_mt);
      }

      for (let i = 0; i < shRows.length; i++) {
        let rbInvJoinObj_sh = {};
        rbInvJoinObj_sh["ri_t0dSH"] = i + 1;
        rbInvJoinObj_sh["new_inv_upcSH"] = shRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sh["new_inv_nameSH"] = shRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sh["new_inv_sh_stockSH"] = shRows[i]["new_inv_sh_stock"];
        // if (shRows[i]['new_inv_sh_stock'] = null) {
        //   rbInvJoinObj_sh['new_inv_sh_stockSH'] = 'EMPTY'
        // } else {
        //   rbInvJoinObj_sh['new_inv_sh_stockSH'] = shRows[i]['new_inv_sh_stock']
        // }
        rbInvJoinObj_sh["old_inv_sh_stockSH"] = shRows[i]["old_inv_sh_stock"];
        // if (shRows[i]['old_inv_sh_stock'] = null) {
        //   rbInvJoinObj_sh['old_inv_sh_stockSH'] = 'EMPTY'
        // } else {
        //   rbInvJoinObj_sh['old_inv_sh_stockSH'] = shRows[i]['old_inv_sh_stock']
        // }

        rbInvJoinArr_sh.push(rbInvJoinObj_sh);
      }

      for (let i = 0; i < glRows.length; i++) {
        let rbInvJoinObj_gl = {};
        rbInvJoinObj_gl["ri_t0dGL"] = i + 1;
        rbInvJoinObj_gl["new_inv_upcGL"] = glRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_gl["new_inv_nameGL"] = glRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_gl["new_inv_gl_stockGL"] = glRows[i]["new_inv_gl_stock"];
        // if (glRows[i]['new_inv_gl_stock'] = null) {
        //   rbInvJoinObj_gl['new_inv_gl_stockGL'] = 'EMPTY'
        // } else {
        //   rbInvJoinObj_gl['new_inv_gl_stockGL'] = glRows[i]['new_inv_gl_stock']
        // }
        rbInvJoinObj_gl["old_inv_gl_stockGL"] = glRows[i]["old_inv_gl_stock"];
        // if (glRows[i]['old_inv_gl_stock'] = null) {
        //   rbInvJoinObj_gl['old_inv_gl_stockGL'] = 'EMPTY'
        // } else {
        //   rbInvJoinObj_gl['old_inv_gl_stockGL'] = glRows[i]['old_inv_gl_stock']
        // }

        rbInvJoinArr_gl.push(rbInvJoinObj_gl);
      }

      rbInvJoinArr_indSani = JSON.stringify(rbInvJoinArr_ind)
        .replace(saniRegex2, `"EMPTY"`)
        .replace(saniRegex1, "");
      rbInvJoinArr_smSani = JSON.stringify(rbInvJoinArr_sm)
        .replace(saniRegex2, `"EMPTY"`)
        .replace(saniRegex1, "");
      rbInvJoinArr_mtSani = JSON.stringify(rbInvJoinArr_mt)
        .replace(saniRegex2, `"EMPTY"`)
        .replace(saniRegex1, "");
      rbInvJoinArr_shSani = JSON.stringify(rbInvJoinArr_sh)
        .replace(saniRegex2, `"EMPTY"`)
        .replace(saniRegex1, "");
      rbInvJoinArr_glSani = JSON.stringify(rbInvJoinArr_gl)
        .replace(saniRegex2, `"EMPTY"`)
        .replace(saniRegex1, "");

      searchResults.push(
        rbInvJoinArr_indSani,
        rbInvJoinArr_smSani,
        rbInvJoinArr_mtSani,
        rbInvJoinArr_shSani,
        rbInvJoinArr_glSani
      );

      let searchResultsToString = searchResults.toString();
      searchResultsSplit = searchResultsToString.split(splitRegex1);
      console.log(`searchResultsSplit.length==> ${searchResultsSplit.length}`);
      console.log(`searchResultsSplit[0]==> ${searchResultsSplit[0]}`);
      console.log(
        `typeof searchResultsSplit[0]==> ${typeof searchResultsSplit[0]}`
      );
      console.log(
        `typeof JSON.parse(searchResultsSplit[0])==> ${typeof JSON.parse(
          searchResultsSplit[0]
        )}`
      );

      for (let k = 0; k < searchResultsSplit.length; k++) {
        let searchResultsSplitParsed = JSON.parse(searchResultsSplit[k]);
        searchResultsSplitParsedArr.push(searchResultsSplitParsed);
      }
      console.log(
        `searchResultsSplitParsedArr[0]['ri_t0dIND']==> ${searchResultsSplitParsedArr[0]["ri_t0dIND"]}`
      );
    }

    connection.query(
      `
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_in_stock AS new_inv_in_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_in_stock AS old_inv_in_stock
    FROM rb_inventory_test updated
    JOIN rb_inventory_test_old orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_in_stock != orig.inv_in_stock
    ORDER BY updated.inv_in_stock, orig.inv_in_stock;
    
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_sm_stock AS new_inv_sm_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_sm_stock AS old_inv_sm_stock
    FROM rb_inventory_test updated
    JOIN rb_inventory_test_old orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_sm_stock != orig.inv_sm_stock
    ORDER BY updated.inv_sm_stock, orig.inv_sm_stock;
    
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_mt_stock AS new_inv_mt_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_mt_stock AS old_inv_mt_stock
    FROM rb_inventory_test updated
    JOIN rb_inventory_test_old orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_mt_stock != orig.inv_mt_stock
    ORDER BY updated.inv_mt_stock, orig.inv_mt_stock;
    
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_sh_stock AS new_inv_sh_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_sh_stock AS old_inv_sh_stock
    FROM rb_inventory_test updated
    JOIN rb_inventory_test_old orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_sh_stock != orig.inv_sh_stock
    ORDER BY updated.inv_sh_stock, orig.inv_sh_stock;
    
    SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_gl_stock AS new_inv_gl_stock,
    orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_gl_stock AS old_inv_gl_stock
    FROM rb_inventory_test updated
    JOIN rb_inventory_test_old orig ON updated.inv_upc
    WHERE updated.inv_upc = orig.inv_upc
    AND updated.inv_gl_stock != orig.inv_gl_stock
    ORDER BY updated.inv_gl_stock, orig.inv_gl_stock;`,
      function (err, rows, fields) {
        if (err) throw err;
        displayRbInvJoin(rows);

        res.json({
          auditResObj: {
            rbInvJoinArr_ind: rbInvJoinArr_ind,
            rbInvJoinArr_sm: rbInvJoinArr_sm,
            rbInvJoinArr_mt: rbInvJoinArr_mt,
            rbInvJoinArr_sh: rbInvJoinArr_sh,
            rbInvJoinArr_gl: rbInvJoinArr_gl,
          },
        });
      }
    );
  }
  rb_inventory_query();
}
