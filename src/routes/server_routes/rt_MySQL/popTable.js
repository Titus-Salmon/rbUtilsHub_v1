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

// express().use(fileUpload({
//   debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
// }))

// router.use(fileUpload({
//   debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
// }))

export async function post(req, res, next) {
  router.use(fileUpload({
    debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
  }))
  // express().use(fileUpload({
  //   debug: true, //set debug mode to try and figure out [ERR_HTTP_HEADERS_SENT]
  // }))
  console.log(`req.body.formData==> ${req.body.formData}`)
  console.log(`req.files==> ${req.files}`)
  console.log(`JSON.stringify(req.files)==> ${JSON.stringify(req.files)}`)
  console.log(`req.body==> ${req.body}`)
  console.log(`JSON.stringify(req.body)==> ${JSON.stringify(req.body)}`)
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // if (Object.keys(req.files).length === 0) {
  //   return res.status(400).send('No files were uploaded.');
  // }

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