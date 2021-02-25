const express = require('express')
const router = express.Router()

const {
  popRbTable
} = require('../routes/server_routes/rt_MySQL/popRbTable')

router.post('/popRbTable', popRbTable)

module.exports = router;