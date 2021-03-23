const fs = require('fs')
console.log(`hello from top level of saveToCSV`)
import queryResArrCache from "../../nodeCacheStuff/cache1"
let queryResArrCacheValue

export async function post(req, res, next) {

    console.log(`hello from within the async function of saveToCSV.js`)

    // queryResArrCacheValue = queryResArrCache.take('queryResArrCache_key') // this also deletes the key
    queryResArrCacheValue = queryResArrCache.get('queryResArrCache_key') // use 'get' to leave key in memory
    console.log(`queryResArrCacheValue[0]==> ${queryResArrCacheValue[0]}`)
    let firstRowOfTableObj = queryResArrCacheValue[0]
    if (firstRowOfTableObj['_#_']) { //delete the _#_ column if it exists, because we don't want that in any iut IMWs
        delete firstRowOfTableObj['_#_']
    }

    //begin csv generator //////////////////////////////////////////////////////////////////////////
    const {
        Parser
    } = require('json2csv')

    const fields = Object.keys(firstRowOfTableObj)
    console.log(`fields==> ${fields}`)

    const opts = {
        fields
    }

    try {
        const parser = new Parser(opts);
        const csv = parser.parse(queryResArrCacheValue)
        console.log(`req.body from saveToCSV==>${req.body}`)
        console.log(`csv.length from saveToCSV==>> ${csv.length}`);
        fs.writeFile(`${process.cwd()}/static/csv/${req.body.data}.csv`, csv, function (err) {
            if (err) throw err;
            console.log(`===>> ${process.cwd()}/static/csv/${req.body.data}.csv saved<<===`)
        })
        // res.json({
        //     "response from saveToCSV": `~~~~~>> ${process.cwd()}/static/csv/${req.body.data}.csv saved <<~~~~~`
        // })
        updateRbCat()
    } catch (err) {
        console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //v//Automatically add note to rainbowcat table that Retail IMW has been generated//////////////////////////////////////


    function updateRbCat() {
        let fileName = req.body.data

        var today = new Date()
        var todayIso = today.toISOString()
        var todayIsoSplitArr = todayIso.split('T')
        var todayIsoSplit = todayIsoSplitArr[0]
        var imwTypeColumn
        var itemsUpdtdTypeColumn

        //here we are doing some js magic to extract the "ediName" from the Rtl IMW name we're saving (nejTableNameRtlIMWYYYMMDD):
        let vendorNameSplit1 = fileName.split('nej')
        let vendorNameSplit2 = vendorNameSplit1[1]
        if (fileName.toLowerCase().includes('rtlimw')) {
            imwTypeColumn = 'rtlImw'
            itemsUpdtdTypeColumn = 'items_updtd_rtl'
            vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('rtlimw')
            updateTypeTotal = 'tot_updtd_rtl'
            console.log(`imwTypeColumn==> ${imwTypeColumn}`)
        }
        if (fileName.toLowerCase().includes('wsimw')) {
            imwTypeColumn = 'wsImw'
            itemsUpdtdTypeColumn = 'items_updtd_ws'
            vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('wsimw')
            updateTypeTotal = 'tot_updtd_ws'
            console.log(`imwTypeColumn==> ${imwTypeColumn}`)
        }


        if (imwTypeColumn !== undefined) { //only attempt to update rainbowcat if you're saving an IMW csv (therefore imwTypeColumn
            //will be truthy)
            let vendorName = vendorNameSplit3[0]
            let ediVendorName = `EDI-${vendorName.toUpperCase()}`
            console.log(`ediVendorName==> ${ediVendorName}`)
            connection.query(`
            UPDATE rainbowcat SET ${imwTypeColumn} = '${req.body.data}.csv (${srcRsCSV_nonPag.length} items)' 
            WHERE ediName = '${ediVendorName}';
    
            INSERT INTO rainbowcat_update_tracker (date, edi_vendor_name, ${imwTypeColumn}, ${itemsUpdtdTypeColumn})
            VALUES('${todayIsoSplit}', 'EDI-${vendorName.toUpperCase()}', '${req.body.data}.csv', '${srcRsCSV_nonPag.length}')
            ON DUPLICATE KEY UPDATE ${imwTypeColumn} = ${imwTypeColumn};
    
            UPDATE rainbowcat rbc
            INNER JOIN (
              SELECT edi_vendor_name,
              SUM(${itemsUpdtdTypeColumn}) as total_updated
              FROM rainbowcat_update_tracker
              GROUP BY edi_vendor_name
            )
            rbcut ON rbc.ediName = rbcut.edi_vendor_name
            SET rbc.${updateTypeTotal} = rbcut.total_updated;`)

            res.json({
                "response from saveToCSV": `~~~>> ${process.cwd()}/static/csv/${req.body.data}.csv saved AND rainbowcat/rainbowcat_update_tracker updated<<~~~`
            })

        } else {
            res.json({
                "response from saveToCSV": `~~~~~>> ${process.cwd()}/static/csv/${req.body.data}.csv saved <<~~~~~`
            })
        }
    }

    // updateRbCat()
    //v//Automatically add note to rainbowcat table that Retail IMW has been generated//////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}