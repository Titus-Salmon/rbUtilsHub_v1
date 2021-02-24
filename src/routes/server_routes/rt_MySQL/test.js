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
  console.log(`Object.values(req) from test.js==> ${Object.values(req)}`)

}