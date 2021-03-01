const fs = require('fs')
console.log(`hello from top level of save_imw_CSV`)
import save_imw_CSV_cache from "../../../nodeCacheStuff/cache1"
let save_imw_CSV_cacheValue

export async function post(req, res, next) {

  console.log(`hello from within the async function of save_imw_CSV.js`)

  // save_imw_CSV_cacheValue = save_imw_CSV_cache.take('save_imw_CSV_cache_key') // this also deletes the key
  save_imw_CSV_cacheValue = save_imw_CSV_cache.get('save_imw_CSV_cache_key') // use 'get' to leave key in memory
  console.log(`JSON.stringify(save_imw_CSV_cacheValue[0])==> ${JSON.stringify(save_imw_CSV_cacheValue[0])}`)
  let firstRowOf_imw_Obj = save_imw_CSV_cacheValue[0]

  //begin csv generator //////////////////////////////////////////////////////////////////////////
  const {
    Parser
  } = require('json2csv')

  const fields = Object.keys(firstRowOf_imw_Obj)
  console.log(`fields==> ${fields}`)

  const opts = {
    fields
  }

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(save_imw_CSV_cacheValue)
    console.log(`req.body from save_imw_CSV==>${req.body}`)
    console.log(`JSON.stringify(req.body) from save_imw_CSV==>${JSON.stringify(req.body)}`)
    console.log(`csv.length from save_imw_CSV==>> ${csv.length}`);
    fs.writeFile(`${process.cwd()}/static/csv/${req.body.data}.csv`, csv, function (err) {
      if (err) throw err;
      console.log(`===>> ${process.cwd()}/static/csv/${req.body.data}.csv saved<<===`)
    })
    res.json({
      "response from save_imw_CSV": `~~~~~>> ${process.cwd()}/static/csv/${req.body.data}.csv saved <<~~~~~`
    })
  } catch (err) {
    console.error(err);
  }
  //end csv generator //////////////////////////////////////////////////////////////////////////
}