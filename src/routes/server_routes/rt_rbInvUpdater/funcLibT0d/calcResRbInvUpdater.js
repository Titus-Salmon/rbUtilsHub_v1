import { rbInvAudit } from "../rbInvUpdater";

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

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

  let srcRsINDstockedSani;
  let srcRsIND_NOTstockedSani;
  let srcRsSMstockedSani;
  let srcRsSM_NOTstockedSani;
  let srcRsMTstockedSani;
  let srcRsMT_NOTstockedSani;
  let srcRsSHstockedSani;
  let srcRsSH_NOTstockedSani;
  let srcRsGLstockedSani;
  let srcRsGL_NOTstockedSani;

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

    let nhcrtRows = rows[2];
    let wishlistRows = rows[3];

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
              nhcrtRows[i]["inv_onhand"] != 0 || //include positive AND negative inv values as stocked, since
              //when inventory is negative, it is usually currently stocked, but just not received correctly.
              nhcrtRows[i]["inv_intransit"] > 0
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
    console.log(`typeof srcRsINDstockedSani==> ${typeof srcRsINDstockedSani}`);
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

  async function queryNhcrtTable() {
    connection
      .query(
        `
    DROP TABLE IF EXISTS rb_inventory_test_old;
    CREATE TABLE rb_inventory_test_old AS SELECT * FROM rb_inventory_test;
    SELECT * FROM nhcrtRbInv;
    SELECT * FROM rb_wishlist;`,
        function (err, rows, fields) {
          if (err) throw err;
          showSearchResults(rows);

          console.log(
            `srcRsINDstocked[0] called from queryNhcrtTable==> ${srcRsINDstocked[0]}`
          );
        }
      )
      .on("end", function () {
        connection
          .query(
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
          )
          .on("end", function () {
            rbInvAudit();
          });
      });
  }
  queryNhcrtTable();
  // .then(rbInvAudit());
  // await rbInvAudit();
}

export { calcResRbInvUpdater };
