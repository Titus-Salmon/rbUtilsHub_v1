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
        res.json({
            "response from saveToCSV": `~~~~~>> ${process.cwd()}/static/csv/${req.body.data}.csv saved <<~~~~~`
        })
    } catch (err) {
        console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////
}