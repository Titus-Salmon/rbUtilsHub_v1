const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  v_InventoryMasterQuery
} = require('../tsqlHub/v_InventoryMasterQuery')


router.get('/', (req, res, next) => {
  res.send(req)
})

router.post('/queryInvMasterTable', v_InventoryMasterQuery)

module.exports = router;