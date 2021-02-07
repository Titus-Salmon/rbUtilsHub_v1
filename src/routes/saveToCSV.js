const fs = require('fs')
console.log(`hello from top level of saveToCSV`)
// const catapultResArrCache = require('../nodeCacheStuff/cache1')
import catapultResArrCache from "../nodeCacheStuff/cache1.js"
let catapultResArrCacheValue

export async function post(req, res, next) {

    console.log(`hello from within the async function of saveToCSV.js`)
    // const catapultResArrCache = require('../nodeCacheStuff/cache1')
    // import catapultResArrCache from "../nodeCacheStuff/cache1.js"

    catapultResArrCacheValue = catapultResArrCache.take('catapultResArrCache_key') // this also deletes the key
    // let firstRowOfTableObj = catapultResArrCache['data']['catapultResArrCache_key']['v'][0]
    console.log(`catapultResArrCacheValue[0]==> ${catapultResArrCacheValue[0]}`)
    let firstRowOfTableObj = catapultResArrCacheValue[0]

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
        // console.log(`req.body['save2CSVArrPost'][0]==>${req.body['save2CSVArrPost'][0]}`)
        // const csv = parser.parse(JSON.parse(req.body['save2CSVArrPost']))
        const csv = parser.parse(catapultResArrCacheValue)
        // console.log(`JSON.stringify(req.body['save2CSVArrPost'][0])-->${JSON.stringify(req.body['save2CSVArrPost'][0])}`)
        console.log(`req.body['csvPost']-->${req.body['csvPost']}`)
        console.log('csv.length=====>>', csv.length);
        fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body['csvPost'] + '.csv', csv, function (err) {
            if (err) throw err;
            console.log('~~~~~>>' + req.body['csvPost'] + 'saved<<~~~~~')
        })
    } catch (err) {
        console.error(err);
    }
    //end csv generator //////////////////////////////////////////////////////////////////////////

    //     catapultResArrCacheValue = catapultResArrCache.take('catapultResArrCache_key') // this also deletes the key
    //     // tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
    //     // console.log(`table_data[0] from saveToCSV==> ${table_data[0]}`);
    //     // console.log(`JSON.stringify(table_data[0]) from saveToCSV==> ${JSON.stringify(table_data[0])}`);
    //     res.setHeader('Content-Type', 'application/json')
    //     console.log(`is anybody home from saveToCSV.js`)

    //     const fs = require('fs')
    //     const {
    //         AsyncParser
    //     } = require('json2csv');

    //     const fields = Object.keys(table_data[0]); //these are the table headers (column names)
    //     console.log(`fields from saveToCSV==> ${fields}`)
    //     const opts = {
    //         fields
    //     };
    //     const transformOpts = {
    //         highWaterMark: 8192
    //     };

    //     const asyncParser = new AsyncParser(opts, transformOpts);

    //     let csv = '';
    //     asyncParser.processor
    //         .on('data', chunk => (csv += chunk.toString()))
    //         .on('end', () => {
    //             console.log(`csv from saveToCSV==> ${csv}`)
    //             fs.writeFile(`${process.cwd()}/static/csv/${req.body.data}.csv`, csv, function (err) {
    //                 if (err) throw err;
    //                 console.log(`~~~~~>> ${process.cwd()}/static/csv/${req.body.data}.csv saved<<~~~~~`)
    //                 res.json({
    //                     "response from saveToCSV": `${process.cwd()}/static/csv/${req.body.data}.csv saved`
    //                 })
    //             })
    //         })
    //         .on('error', err => console.error(err));
    // const fs = require('fs')
    // const {
    //     parseAsync
    // } = require('json2csv');
    // const fields = Object.keys(table_data[0]); //these are the table headers (column names)
    // const opts = {
    //     fields
    // };

    // parseAsync(table_data, opts)
    //     .then(csv => console.log(`csv from saveToCSV==> ${csv}`))
    //     .then(fs.writeFile(process.cwd() + '/static/csv/' + req.body.data + '.csv', csv, function (err) {
    //         if (err) throw err;
    //         console.log(`~~~~~>> ${req.body.data} saved<<~~~~~`)
    //     }))
    //     .catch(err => console.error(err));
}