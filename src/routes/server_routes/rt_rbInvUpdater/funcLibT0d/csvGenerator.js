const fs = require("fs");

async function csvGenerator(catapultResArr) {
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

export { csvGenerator };
