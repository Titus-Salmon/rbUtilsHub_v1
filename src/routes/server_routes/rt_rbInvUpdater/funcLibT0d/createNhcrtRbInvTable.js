import { populateNhcrtRbInvTable } from "../funcLibT0d/populateNhcrtRbInvTable";

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

async function createNhcrtRbInvTable() {
  let createNhcrtRbInvTableQuery = `
  DROP TABLE IF EXISTS nhcrtRbInv;
  CREATE TABLE nhcrtRbInv (ri_t0d int NOT NULL AUTO_INCREMENT, INV_ScanCode VARCHAR(255), sto_number VARCHAR(255), 
  inv_lastreceived VARCHAR(255), inv_lastsold VARCHAR(255), inv_onhand VARCHAR(255), inv_onorder VARCHAR(255), 
  inv_intransit VARCHAR(255), PRIMARY KEY (ri_t0d));
  `;
  let populateNhcrtRbInvTableQuery = `
  LOAD DATA LOCAL INFILE './static/csv/rb_inv_nhcrt.csv' INTO TABLE nhcrtRbInv FIELDS TERMINATED BY ',' 
  ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;`; //"IGNORE 1 LINES" skips the 1st row of the csv (which is the column name line)
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
