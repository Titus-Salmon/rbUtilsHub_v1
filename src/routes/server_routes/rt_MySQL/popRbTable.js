const fs = require('fs')
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

  if (Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  //[1] 1st you have to upload the file
  let fileToUpload = req.files.popTableFile;
  console.log(`fileToUpload==> ${fileToUpload}`)

  //[2] then use the mv() method to place the file somewhere on your server, in order to use it to populate the table below
  fileToUpload.mv(process.cwd() + '/static/csv-to-insert/' + fileToUpload.name, function (err) {
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
    deleteCSV()
    res.json({
      "response1 from popTable": `~~~~~>> ${process.cwd()}/static/csv-to-insert/${fileToUpload.name}.csv SAVED <<~~~~~`,
      "response2 from popTable": `~~~~~>> ${tableToPopulate} POPULATED <<~~~~~`,
      "response3 from popTable": `~~~~~>> ${fileToUpload.name} deleted <<~~~~~`,
    })
  })

  function deleteCSV() {
    try {
      fs.unlinkSync(`${process.cwd()}/static/csv-to-insert/${fileToUpload.name}`, function (err) {
        if (err) throw err;
        console.log(`~~~~~>> ${fileToUpload.name} deleted <<~~~~~`)
      })
    } catch (err) {
      console.error(err);
    }
  }
}