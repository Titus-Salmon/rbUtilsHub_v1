const express = require('express')
const fileUpload = require('express-fileupload')

const mysql = require('mysql')

const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB,
  debug: true,
  multipleStatements: true
})

express.use(fileUpload({
  debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
}))

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

  // function createPopTable() {
  //   //the LOAD DATA LOCAL INFILE part below is a little tricky, because you can't use ${process.cwd()/static/csv}/${fileName}.csv
  //   //to get to your file, but have to use ./static/csv/${fileName} instead. IMPORTANT!
  //   connection.query(`
  //   CREATE TABLE ${tableName} (ri_t0d int NOT NULL AUTO_INCREMENT, ${columnNames}, PRIMARY KEY (ri_t0d));

  //   LOAD DATA LOCAL INFILE './static/csv/${fileName}.csv' INTO TABLE ${tableName} FIELDS TERMINATED BY ','
  //      ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;
  //   `, (error, response) => {
  //       console.log(error || response);
  //     })
  //     .on('end', function () {
  //       console.log(`hello from connection.query().on('end')`)
  //       deleteCSV()
  //       console.log(`~~~~~>> ${process.cwd()}/static/csv/${fileName}.csv DELETED <<~~~~~`)
  //       res.json({
  //         "response1 from saveToCSVcreatePop": `~~~~~>> ${process.cwd()}/static/csv/${fileName}.csv SAVED <<~~~~~`,
  //         "response2 from saveToCSVcreatePop": `~~~~~>> MySQL table: ${tableName} created in RB DB<<~~~~~`,
  //         "response3 from saveToCSVcreatePop": `~~~~~>> ${process.cwd()}/static/csv/${fileName}.csv DELETED <<~~~~~`
  //       })
  //     })
  // }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let fileToUpload = req.files.popTableFile;
  console.log(`fileToUpload==> ${fileToUpload}`)

  // Use the mv() method to place the file somewhere on your server
  fileToUpload.mv(process.cwd() + '/static/csv-to-insert/' + fileToUpload.name, function (err) {
    //might want to try and use the actual UNC path here (\\WEBSERVER...)
    if (err)
      return res.status(500).send(err);
  })

  let tableToPopulate = req.body['popTableTableName']
  console.log(`req.body['popTableTableName']==> ${req.body['popTableTableName']}`)

  let popTableQuery = `LOAD DATA LOCAL INFILE './static/csv-to-insert/${fileToUpload.name}' INTO TABLE ${tableToPopulate} FIELDS TERMINATED BY ','
     ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;` //"IGNORE 1 LINES" skips the 1st row of the csv (which is the column name line)

  connection.query(popTableQuery, (error, response) => {
    if (error) {
      console.log('error===>', error)
    } else {
      console.log('response==>', response);
    }
  }).on('end', function () {
    // all rows have been received
    res.json({
      "response1 from popTable": `~~~~~>> ${process.cwd()}/static/csv-to-insert/${fileName}.csv SAVED <<~~~~~`,
    })
  })



}