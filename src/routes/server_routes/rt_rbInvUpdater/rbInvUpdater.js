import { rb_inventory_query } from "./funcLibT0d/rb_inventory_query";

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

  connection
    .query(rb_inventoryQuery, function (err, rows, fields) {
      rb_inventory_query(rb_inventoryQuery, rb_invUPCs);
    })
    .on("end", function () {
      queryCatapultWithRbInvUPCs(rb_invUPCs);
    });
}
