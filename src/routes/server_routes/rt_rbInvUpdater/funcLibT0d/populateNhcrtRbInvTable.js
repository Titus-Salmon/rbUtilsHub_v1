import { calcResRbInvUpdater } from "../funcLibT0d/calcResRbInvUpdater";

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

async function populateNhcrtRbInvTable(populateNhcrtRbInvTableQuery) {
  connection
    .query(populateNhcrtRbInvTableQuery, function (error, response) {
      if (error) {
        console.log(`error from populateNhcrtRbInvTable==> ${error}`);
      }
    })
    .on("end", function () {
      calcResRbInvUpdater();
    });
}

export { populateNhcrtRbInvTable };
