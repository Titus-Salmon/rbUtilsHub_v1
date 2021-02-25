const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  debug: true,
  multipleStatements: true
})

export async function post(req, res, next) {

  let tableName = deleteTablePostBody['delTblNamePost']

  let mySqlQuery = `DROP TABLE ${tableName};`

  if (tableName.toLowerCase().includes('nej') || tableName.toLowerCase().includes('nhcrt') ||
    tableName.toLowerCase().includes('nisf') || tableName.toLowerCase().includes('portinfra') ||
    tableName.toLowerCase().includes('rb_inventory_titus') || tableName.toLowerCase().includes('rcth') ||
    tableName.toLowerCase().includes('infrasales') || tableName.toLowerCase().includes('gpet') ||
    tableName.toLowerCase().includes('icat') || tableName.toLowerCase().includes('wo_mv')) {
    connection.query(mySqlQuery, (error, response) => {
      console.log(`error==>${error}` || `response==>${response}`)
    }).on('end', function () {
      res.json({
        "response1 from deleteRbTable": `~~~~~>> ${tableName} DELETED <<~~~~~`,
      })
    })
  } else {
    res.json({
      "response1 from deleteRbTable": `${tableName} **NOT** Deleted, as it does not conform to nej/nhcrt naming standards`,
    })
  }
}