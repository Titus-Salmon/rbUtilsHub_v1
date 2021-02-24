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

}