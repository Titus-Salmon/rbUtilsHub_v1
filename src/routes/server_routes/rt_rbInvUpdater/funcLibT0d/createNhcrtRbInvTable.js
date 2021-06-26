import { populateNhcrtRbInvTable } from "../funcLibT0d/populateNhcrtRbInvTable";

async function createNhcrtRbInvTable() {
  let createNhcrtRbInvTableQuery = `
  DROP TABLE IF EXISTS nhcrtRbInv;
  CREATE TABLE nhcrtRbInv (ri_t0d int NOT NULL AUTO_INCREMENT, INV_ScanCode VARCHAR(255), sto_number VARCHAR(255), 
  inv_lastreceived VARCHAR(255), inv_lastsold VARCHAR(255), inv_onhand VARCHAR(255), inv_onorder VARCHAR(255), 
  inv_intransit VARCHAR(255), PRIMARY KEY (ri_t0d));
  `;
  console.log(`hello from within createNhcrtRbInvTable()`);
  connection
    .query(createNhcrtRbInvTableQuery, function (error, response) {
      if (error) {
        console.log(`error from createNhcrtRbInvTable==> ${error}`);
      }
    })
    .on("end", function () {
      populateNhcrtRbInvTable(populateNhcrtRbInvTableQuery);
    });
}

export { createNhcrtRbInvTable };
