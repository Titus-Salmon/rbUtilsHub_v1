const fs = require('fs')
import catapultResArrCache from "../../../nodeCacheStuff/cache1"
let catapultResArrCacheValue

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

  catapultResArrCacheValue = catapultResArrCache.take('catapultResArrCache_key') // this also deletes the key
  console.log(`catapultResArrCacheValue[0]==> ${catapultResArrCacheValue[0]}`)
  let firstRowOfTableObj = catapultResArrCacheValue[0]

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
    connection.query(`
    CREATE TABLE ${tableName} (ri_t0d int NOT NULL AUTO_INCREMENT, ${columnNames}, PRIMARY KEY (ri_t0d));
    
    LOAD DATA LOCAL INFILE '${process.cwd()}/static/csv/${fileName}.csv' INTO TABLE ${tableName} FIELDS TERMINATED BY ','
     ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;
    `, (error, response) => {
      console.log(error || response);
    }).on('end', function () {
      res.json({
        "response from saveToCSVcreatePop": `
        ~~~~~>> ${process.cwd()}/static/csv/${req.body.data}.csv saved <<~~~~~
        ~~~~~>> MySQL table: ${tableName} created in RB DB<<~~~~~`
      })
      // res.render('vw-MySqlTableHub', {
      //   title: `vw-MySqlTableHub **Populated Table <<${tableName}>>**`,
      //   // tableColNames: tableColumnNames,
      //   sqlTablePopulated: {
      //     tablePopulated: tableName,
      //   },
      // })
    })
  }

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(catapultResArrCacheValue)
    console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
    console.log('csv.length=====>>', csv.length);
    fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
      if (err) throw err;
      console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
      createPopTable()
    })
  } catch (err) {
    console.error(err);
  }

}