const mysql = require('mysql')
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  debug: true
})

export async function post(req, res, next) {

  let tableName = req.body.createTableTableName

  // const createTablePostBody = req.body
  // let tableName = createTablePostBody['tblNamePost']
  let columnNames = []
  let tableHeaders = req.body.createTableColNames
  let tableHeadersArray = tableHeaders.split(',')
  for (let i = 0; i < tableHeadersArray.length; i++) {
    let columnName = tableHeadersArray[i] + ' VARCHAR(255)'
    console.log(`columnName==> ${columnName}`)
    columnNames.push(columnName)
  }

  let mySqlQuery = `CREATE TABLE ${tableName} (ri_t0d int NOT NULL AUTO_INCREMENT, ${columnNames}, PRIMARY KEY (ri_t0d));`

  connection.query(mySqlQuery, (error, response) => {
    console.log(error || response);
  }).on('end', function () {
    // all rows have been received
    res.json({
      "response1 from createTable": `~~~~~>> Table Created: <<${tableName}>> <<~~~~~`,
    })
  })
}