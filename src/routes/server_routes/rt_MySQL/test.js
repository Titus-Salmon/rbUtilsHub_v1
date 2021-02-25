const express = require('express')
const fileUpload = require('express-fileupload')
const router = express.Router()

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

  console.log(`req from test.js==> ${req}`)
  console.log(`req.length from test.js==> ${req.length}`)
  console.log(`Object.keys(req) from test.js==> ${Object.keys(req)}`)
  console.log(`req.body from test.js==> ${req.body}`)
  console.log(`JSON.stringify(req.body) from test.js==> ${JSON.stringify(req.body)}`)
  console.log(`Object.keys(req.body) from test.js==> ${Object.keys(req.body)}`)
  console.log(`req.files==> ${req.files}`)

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //   // if (Object.keys(req.files).length === 0) {
  //   //   return res.status(400).send('No files were uploaded.');
  //   // }

  //   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  //   let fileToUpload = req.files.popTableFile;
  //   console.log(`fileToUpload==> ${fileToUpload}`)

  //   // Use the mv() method to place the file somewhere on your server
  //   fileToUpload.mv(process.cwd() + '/static/csv-to-insert/' + fileToUpload.name, function (err) {
  //     //might want to try and use the actual UNC path here (\\WEBSERVER...)
  //     if (err)
  //       return res.status(500).send(err);
  //   })

  //   let tableToPopulate = req.body['popTableTableName']
  //   console.log(`req.body['popTableTableName']==> ${req.body['popTableTableName']}`)

  //   let popTableQuery = `LOAD DATA LOCAL INFILE './static/csv-to-insert/${fileToUpload.name}' INTO TABLE ${tableToPopulate} FIELDS TERMINATED BY ','
  //      ENCLOSED BY '"' LINES TERMINATED BY '\r\n' IGNORE 1 LINES;` //"IGNORE 1 LINES" skips the 1st row of the csv (which is the column name line)

  //   connection.query(popTableQuery, (error, response) => {
  //     if (error) {
  //       console.log('error===>', error)
  //     } else {
  //       console.log('response==>', response);
  //     }
  //   }).on('end', function () {
  //     // all rows have been received
  //     res.json({
  //       "response1 from popTable": `~~~~~>> ${process.cwd()}/static/csv-to-insert/${fileName}.csv SAVED <<~~~~~`,
  //     })
  //   })

  res.json({
    "response from test.js": "response"
  })

}