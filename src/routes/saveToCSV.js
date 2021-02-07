import tableData from "../components/dynamicTalbes/tableStores/tableData1.js"; //import table data from Svelte tableData1.js store
let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
console.log(`table_data[0] from saveToCSV==> ${table_data[0]}`);

export async function post(req, res, next) {
    let table_data;
    tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
    console.log(`table_data[0] from saveToCSV==> ${table_data[0]}`);
    const fs = require('fs')
    const {
        AsyncParser
    } = require('json2csv');

    const fields = Object.keys(table_data[0]); //these are the table headers (column names)
    const opts = {
        fields
    };
    const transformOpts = {
        highWaterMark: 8192
    };

    const asyncParser = new AsyncParser(opts, transformOpts);

    let csv = '';
    asyncParser.processor
        .on('data', chunk => (csv += chunk.toString()))
        .on('end', () => {
            console.log(`csv from saveToCSV==> ${csv}`)
            fs.writeFile(`${process.cwd()}/static/csv/${req.body.data}.csv`, csv, function (err) {
                if (err) throw err;
                console.log(`~~~~~>> ${process.cwd()}/static/csv/${req.body.data}.csv saved<<~~~~~`)
                res.json({
                    "response from saveToCSV": `${process.cwd()}/static/csv/${req.body.data}.csv saved`
                })
            })
        })
        .on('error', err => console.error(err));
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