const fs = require('fs')
import queryResArrCache from "../../../nodeCacheStuff/cache1"
let queryResArrCacheValue

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

  // queryResArrCacheValue = queryResArrCache.take('queryResArrCache_key') // 'take' also deletes the key
  queryResArrCacheValue = queryResArrCache.get('queryResArrCache_key') // use 'get' to leave key in memory
  console.log(`queryResArrCacheValue[0]==> ${queryResArrCacheValue[0]}`)
  let firstRowOfTableObj = queryResArrCacheValue[0]

  //begin csv generator //////////////////////////////////////////////////////////////////////////
  const {
    Parser
  } = require('json2csv')

  const fields = Object.keys(firstRowOfTableObj)
  console.log(`fields==> ${fields}`)

  const opts = {
    fields
  }

  let fileName = req.body.fileNameData

  let tableName = req.body.tableNameData
  let columnNames = []
  for (let i = 1; i < fields.length; i++) { //start count at 1, not 0, in order to skip the ri_t0d, which will be added as auto_increment
    //in the query below
    let columnName = fields[i] + ' VARCHAR(255)'
    console.log(`columnName==> ${columnName}`)
    columnNames.push(columnName)
  }

  function createPopTable() {
    //the LOAD DATA LOCAL INFILE part below is a little tricky, because you can't use ${process.cwd()/static/csv}/${fileName}.csv
    //to get to your file, but have to use ./static/csv/${fileName} instead. IMPORTANT!
    connection.query(`
    CREATE TABLE ${tableName} (ri_t0d int NOT NULL AUTO_INCREMENT, ${columnNames}, PRIMARY KEY (ri_t0d));

    LOAD DATA LOCAL INFILE './static/csv/${fileName}.csv' INTO TABLE ${tableName} FIELDS TERMINATED BY ','
       ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;
    `, (error, response) => {
        console.log(error || response);
      })
      .on('end', function () {
        // res.json({
        //   "response1 from saveToCSVcreatePop": `~~~~~>> ${process.cwd()}/static/csv/${fileName}.csv saved <<~~~~~`,
        //   "response2 from saveToCSVcreatePop": `~~~~~>> MySQL table: ${tableName} created in RB DB<<~~~~~`
        // })
        console.log(`hello from connection.query().on('end')`)
      })
  }

  async function saveCSV() {
    try {
      const parser = new Parser(opts);
      const csv = parser.parse(queryResArrCacheValue)
      console.log(`fileName-->${fileName}`)
      console.log('csv.length=====>>', csv.length);
      fs.writeFile(`${process.cwd()}/static/csv/${fileName}.csv`, csv, function (err) {
        if (err) throw err;
        console.log(`~~~~~>> ${fileName} saved <<~~~~~`)
        console.log(`~~~~~>> populating ${tableName} table <<~~~~~`)
        createPopTable()
      })
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteCSV() {
    try {
      fs.unlink(`${process.cwd()}/static/csv/${fileName}.csv`, function (err) {
        if (err) throw err;
        console.log(`~~~~~>> ${fileName} deleted <<~~~~~`)
        //createPopTable()
        res.json({
          "response1 from saveToCSVcreatePop": `~~~~~>> ${process.cwd()}/static/csv/${fileName}.csv SAVED <<~~~~~`,
          "response2 from saveToCSVcreatePop": `~~~~~>> MySQL table: ${tableName} created in RB DB<<~~~~~`,
          "response3 from saveToCSVcreatePop": `~~~~~>> ${process.cwd()}/static/csv/${fileName}.csv DELETED <<~~~~~`
        })
      })
    } catch (err) {
      console.error(err);
    }
  }

  saveCSV().then(deleteCSV())

}