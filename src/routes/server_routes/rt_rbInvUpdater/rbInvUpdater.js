import { rb_inventory_query } from "./funcLibT0d/rb_inventory_query";
// import { createNhcrtRbInvTable } from "./funcLibT0d/createNhcrtRbInvTable";
import { queryCatapultWithRbInvUPCs } from "./funcLibT0d/queryCatapultWithRbInvUPCs";
import {
  calcResRbInvUpdater,
  srcRsINDstocked,
} from "./funcLibT0d/calcResRbInvUpdater";

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

export async function post(req, res, next) {
  console.log(`JSON.stringify(req.body)==> ${JSON.stringify(req.body)}`);
  let rb_inventoryQuery = req.body.initialQueryText;
  let rb_invUPCs = [];

  let createNhcrtRbInvTableQuery = `
  DROP TABLE IF EXISTS nhcrtRbInv;
  CREATE TABLE nhcrtRbInv (ri_t0d int NOT NULL AUTO_INCREMENT, INV_ScanCode VARCHAR(255), sto_number VARCHAR(255), 
  inv_lastreceived VARCHAR(255), inv_lastsold VARCHAR(255), inv_onhand VARCHAR(255), inv_onorder VARCHAR(255), 
  inv_intransit VARCHAR(255), PRIMARY KEY (ri_t0d));
  `;
  let populateNhcrtRbInvTableQuery = `
  LOAD DATA LOCAL INFILE './static/csv/rb_inv_nhcrt.csv' INTO TABLE nhcrtRbInv FIELDS TERMINATED BY ',' 
  ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;`; //"IGNORE 1 LINES" skips the 1st row of the csv (which is the column name line)

  connection
    .query(rb_inventoryQuery, function (err, rows, fields) {
      if (err) {
        console.log(`err==> ${err}`);
      }
      rb_inventory_query(rows, rb_invUPCs);
    })
    .on("end", async function () {
      queryCatapultWithRbInvUPCs(rb_invUPCs).then(
        connection
          .query(createNhcrtRbInvTableQuery, function (error, response) {
            if (error) {
              console.log(`error from createNhcrtRbInvTable==> ${error}`);
            }
            console.log(
              `createNhcrtRbInvTableQuery==> ${createNhcrtRbInvTableQuery}`
            );
          })
          .on("end", function () {
            connection
              .query(populateNhcrtRbInvTableQuery, function (error, response) {
                if (error) {
                  console.log(`error from populateNhcrtRbInvTable==> ${error}`);
                }
                console.log(
                  `populateNhcrtRbInvTableQuery==> ${populateNhcrtRbInvTableQuery}`
                );
              })
              .on("end", function () {
                calcResRbInvUpdater().then(setTimeout(rbInvAudit, 30000)); //the weak link: why can't we get rbInvAudit
                //to run after calcResInvUpdater (and all of it's internal nested queries) is fully complete, without
                //resorting to setTimeout???
              });
          })
      );
    });
  async function rbInvAudit() {
    let rbInvJoinArr_ind = [];
    let rbInvJoinArr_sm = [];
    let rbInvJoinArr_mt = [];
    let rbInvJoinArr_sh = [];
    let rbInvJoinArr_gl = [];

    function displayRbInvJoin(rows) {
      let searchResults = []; //clear searchResults from previous search
      let searchResultsSplitParsedArr = [];

      let saniRegex1 = /(\[)|(\])/g;
      let saniRegex2 = /""/g;

      /* X(?=Y) 	Positive lookahead 	X if followed by Y
       * (?<=Y)X 	Positive lookbehind 	X if after Y
       * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
      let splitRegex1 = /(?<=}),(?={)/g;

      let rbInvJoinArr_indSani;
      let rbInvJoinArr_smSani;
      let rbInvJoinArr_mtSani;
      let rbInvJoinArr_shSani;
      let rbInvJoinArr_glSani;

      let searchResultsSplit;
      console.log(
        `JSON.stringify(rows[0][0]) from displayRbInvJoin()==> ${JSON.stringify(
          rows[0][0]
        )}`
      );
      console.log(
        `JSON.stringify(rows[0]) from displayRbInvJoin()==> ${JSON.stringify(
          rows[0]
        )}`
      );
      console.log(
        `JSON.stringify(rows) from displayRbInvJoin()==> ${JSON.stringify(
          rows
        )}`
      );
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
        rbInvJoinObj_ind["old_inv_in_stockIND"] =
          indRows[i]["old_inv_in_stock"];
        rbInvJoinArr_ind.push(rbInvJoinObj_ind);
      }

      for (let i = 0; i < smRows.length; i++) {
        let rbInvJoinObj_sm = {};
        rbInvJoinObj_sm["ri_t0dSM"] = i + 1;
        rbInvJoinObj_sm["new_inv_upcSM"] = smRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sm["new_inv_nameSM"] = smRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sm["new_inv_sm_stockSM"] = smRows[i]["new_inv_sm_stock"];
        rbInvJoinObj_sm["old_inv_sm_stockSM"] = smRows[i]["old_inv_sm_stock"];
        rbInvJoinArr_sm.push(rbInvJoinObj_sm);
      }

      for (let i = 0; i < mtRows.length; i++) {
        let rbInvJoinObj_mt = {};
        rbInvJoinObj_mt["ri_t0dMT"] = i + 1;
        rbInvJoinObj_mt["new_inv_upcMT"] = mtRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_mt["new_inv_nameMT"] = mtRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_mt["new_inv_mt_stockMT"] = mtRows[i]["new_inv_mt_stock"];
        rbInvJoinObj_mt["old_inv_mt_stockMT"] = mtRows[i]["old_inv_mt_stock"];
        rbInvJoinArr_mt.push(rbInvJoinObj_mt);
      }

      for (let i = 0; i < shRows.length; i++) {
        let rbInvJoinObj_sh = {};
        rbInvJoinObj_sh["ri_t0dSH"] = i + 1;
        rbInvJoinObj_sh["new_inv_upcSH"] = shRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sh["new_inv_nameSH"] = shRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_sh["new_inv_sh_stockSH"] = shRows[i]["new_inv_sh_stock"];
        rbInvJoinObj_sh["old_inv_sh_stockSH"] = shRows[i]["old_inv_sh_stock"];
        rbInvJoinArr_sh.push(rbInvJoinObj_sh);
      }

      for (let i = 0; i < glRows.length; i++) {
        let rbInvJoinObj_gl = {};
        rbInvJoinObj_gl["ri_t0dGL"] = i + 1;
        rbInvJoinObj_gl["new_inv_upcGL"] = glRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_gl["new_inv_nameGL"] = glRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
        rbInvJoinObj_gl["new_inv_gl_stockGL"] = glRows[i]["new_inv_gl_stock"];
        rbInvJoinObj_gl["old_inv_gl_stockGL"] = glRows[i]["old_inv_gl_stock"];
        rbInvJoinArr_gl.push(rbInvJoinObj_gl);
      }

      console.log(
        `rbInvJoinArr_ind from displayRbInvJoin()==> ${rbInvJoinArr_ind}`
      );

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
      console.log(`searchResults[0]==> ${searchResults[0]}`);
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
        console.log(
          `JSON.stringify(rows[0]) from connection.query from within rbInvAudit==> ${JSON.stringify(
            rows[0]
          )}`
        );
        displayRbInvJoin(rows);
        // setTimeout(displayRbInvJoin, 10000, rows);

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
  // setTimeout(rbInvAudit, 20000);
}
