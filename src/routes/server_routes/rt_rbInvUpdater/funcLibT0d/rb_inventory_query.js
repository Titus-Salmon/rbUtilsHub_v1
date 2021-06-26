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
