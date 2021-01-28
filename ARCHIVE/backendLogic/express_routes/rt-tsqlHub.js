const express = require('express')
const router = express.Router()

//v//destructuring////////////////////////////////
const {
  v_InventoryMasterQuery
} = require('../tsqlHub/v_InventoryMasterQuery')


router.get('/', (req, res, next) => {
  res.send('you are here')
})

router.post('/queryInvMasterTable', v_InventoryMasterQuery)

module.exports = router;