import { csvGenerator } from "../funcLibT0d/csvGenerator";
import { createNhcrtRbInvTable } from "../funcLibT0d/createNhcrtRbInvTable";

const odbc = require("odbc");
const DSN = process.env.ODBC_CONN_STRING;

async function queryCatapultWithRbInvUPCs(rb_invUPCs) {
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
        let catapultResArr = [];
        async function catapultResults(result, catapultResArr) {
          console.log(
            `result.length from catapultResults(result)~~~> ${result.length}`
          );
          for (let i = 0; i < result.length; i++) {
            let catapultResObj = {};
            catapultResObj["ri_t0d"] = i + 1;
            if (typeof result[i]["INV_ScanCode"] == "string") {
              catapultResObj["INV_ScanCode"] = result[i]["INV_ScanCode"].trim();
            } else {
              catapultResObj["INV_ScanCode"] = result[i]["INV_ScanCode"];
            }
            if (typeof result[i]["sto_number"] == "string") {
              catapultResObj["sto_number"] = result[i]["sto_number"].trim();
            } else {
              catapultResObj["sto_number"] = result[i]["sto_number"];
            }
            catapultResObj["inv_lastreceived"] = result[i]["inv_lastreceived"];
            catapultResObj["inv_lastsold"] = result[i]["inv_lastsold"];
            catapultResObj["inv_onhand"] = result[i]["inv_onhand"];
            catapultResObj["inv_onorder"] = result[i]["inv_onorder"];
            catapultResObj["inv_intransit"] = result[i]["inv_intransit"];

            catapultResArr.push(catapultResObj);
          }
        }
        if (error) {
          console.error(error);
        }
        catapultResults(result, catapultResArr).then(
          csvGenerator(catapultResArr).then(createNhcrtRbInvTable())
        );
      });
    });
  }

  await odbcPart(catapultDbQuery);
}

export { queryCatapultWithRbInvUPCs };
