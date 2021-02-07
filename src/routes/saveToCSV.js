import tableData from "../components/dynamicTalbes/tableStores/tableData1.js"; //import table data from Svelte tableData1.js store
let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
console.log(`table_data[0] from saveToCSV==> ${table_data[0]}`);

export async function post(req, res, next) {
    const fs = require('fs')
    const {
        parseAsync
    } = require('json2csv');
    const fields = Object.keys(table_data[0]); //these are the table headers (column names)
    const opts = {
        fields
    };

    parseAsync(table_data, opts)
        .then(csv => console.log(`csv from saveToCSV==> ${csv}`))
        .then(fs.writeFile(process.cwd() + '/public/csv-to-insert/' + req.body.data + '.csv', csv, function (err) {
            if (err) throw err;
            console.log(`~~~~~>> ${req.body.data} saved<<~~~~~`)
        }))
        .catch(err => console.error(err));
}