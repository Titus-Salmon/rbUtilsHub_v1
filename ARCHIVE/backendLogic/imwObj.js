const express = require('express')
const router = express.Router()
module.exports = {

  imwObj: router.get(`/`, (req, res, next) => {

    //all objects have a prototype property
    //all properties are objects
    //the prototype property name for every object = 'proto'
    const imwObject = {
      itemID: {
        column_number: 1,
        def: `The Item ID is what is scanned or selected at the register for each item being purchased. It can contain up to 14 characters that uniquely identify an inventory item or a “package item” within a CATAPULT® system. Item IDs encompass UPCs (Universal Price Codes) and PLUs (Price Look-ups). For instance, the PLU for a banana (4011) is also considered the Item ID for the banana. The CATAPULT User Guide (or OLM – Online Manual) contains specific recommendations for formatting Item IDs for specific types of Global Trade Item Numbers (GTIN), such as produce and bulk PLU codes, and for store-assigned product numbers. It is important to follow those recommendations for many of the features of CATAPULT to work properly. This term is sometimes used interchangeably with “Scan code.”`,
        getDef: function () {
          return this.def
        }
      }
    }

    //Object.create() takes 2 arguments:
    //[1] the desired prototype of the object being created
    //[2] optional Properties Descriptor object
    const imwObjInstance1 = Object.create(imwObject, {
      getInstance1Def: function () {
        console.log(itemID.getDef())
      }
    })
    //You can use Object.getOwnPropertyDescriptor to get a Property Descriptor on any object
    console.log(`JSON.stringify(Object.getOwnPropertyDescriptor(imwObjInstance1, 'getInstance1Def'))==> ${JSON.stringify(Object.getOwnPropertyDescriptor(imwObjInstance1, 'getInstance1Def'))}`)
    console.log(`JSON.stringify(imwObject)==> ${JSON.stringify(imwObject)}`)
    console.log(`JSON.stringify(imwObject).length==> ${JSON.stringify(imwObject).length}`)
    res.json(imwObject)

  })
}