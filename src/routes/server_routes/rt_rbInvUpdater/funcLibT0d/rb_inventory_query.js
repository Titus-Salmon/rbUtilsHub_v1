const mysql = require("mysql");

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  multipleStatements: true, //MUST HAVE to make more than 1 sql statement in a single query
});

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

export { rb_inventory_query };
