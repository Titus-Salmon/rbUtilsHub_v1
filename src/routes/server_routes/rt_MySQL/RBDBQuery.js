const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.RB_HOST,
  user: process.env.RB_USER,
  password: process.env.RB_PW,
  database: process.env.RB_DB
})

import {
  totalPages,
  paginCalcs
} from "../../../libT0d/commonMethods/paginCalcs"

import {
  rbDBqueryResults
} from "../../../libT0d/MySQL/rbDBqueryResults"

export async function post(req, res, next) {
  console.log(`hello from within the async function of RBDBQuery.js`)

  res.setHeader('Content-Type', 'application/json')
  console.log(`req.body.data==> ${req.body.data}`)
  let RBDbQuery = req.body.data

  let queryResArr = [] //array that holds all query results Objs
  let queryResArr_1stPage = [] //array that holds 1st page of query results Objs
  var srcRsXLS = [] //array that holds all query results Objs for generating excel files. Do we need a separate array for this?
  //maybe not, but keeping it this way, in case we need it to be separate from queryResArr in the future. Just cleaner to handle
  //it this way.

  connection.query(RBDbQuery, function (err, rows, fields) {
    if (err) throw err
    console.log(`rows.length==>${rows.length}`)
    console.log('rows[0]==>', rows[0])
    rbDBqueryResults(rows, queryResArr, srcRsXLS, queryResArr_1stPage).then(paginCalcs(queryResArr)).then(() => {
      res.json({
        queryResArr: queryResArr, //this is the entire result set (which we actually may not need to be passing to the front)
        queryResArr_1stPage: queryResArr_1stPage, //this is the 1st page of results, showing the 1st 100 rows
        // "queryResArr_pagin": queryResArr_pagin, //this is whatever page of results we're cal;ing, based on pagination
        totalPages: totalPages,
        currentPage: 1, //set  currentPage to 1 for initial query response, since we'll be on the 1st page
        // nextPage: 1,
        // prevPage: null
      })
    })
  })
}