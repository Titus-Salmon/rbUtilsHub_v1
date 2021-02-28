import queryResArrCache from "../../nodeCacheStuff/cache1"

async function rbDBqueryResults(result, queryResArr, srcRsXLS, queryResArr_1stPage) {

  let queriedColumns = Object.keys(result[0])
  console.log(`queriedColumns==> ${queriedColumns}`)

  for (let i = 0; i < result.length; i++) { //we are abstracting query result handling here, in order to be able to provide
    //front-end results for any columns that are queried, not just a fixed set of columns 
    let rowData = result[i] //data from row #i
    let rbDBresObj = {}
    rbDBresObj['ri_t0d'] = i + 1
    for (let j = 0; j < queriedColumns.length; j++) {
      let colName = queriedColumns[j]

      rbDBresObj[`${colName}`] = rowData[`${colName}`]

    }
    queryResArr.push(rbDBresObj)
    srcRsXLS.push(rbDBresObj)
  }

  if (queryResArr.length > 100) { //if there are more than 100 query results, only push the 1st 100 into the 1st page
    //result set (queryResArr_1stPage)
    for (let i = 0; i < 100; i++) {
      queryResArr_1stPage.push(queryResArr[i])
    }
  } else {
    queryResArr_1stPage = queryResArr //if there are 100 or less total query results, the 1st page results are set equal
    //to the whole query result dataset (queryResArr)
  }

  //V// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND (for saveToCSV, and possibly other things)//////////////////////////////////////////////////////////////////////////////
  queryResArrCache.set('queryResArrCache_key', queryResArr)
  console.log(`queryResArrCache['data']['queryResArrCache_key']['v'].length==> ${queryResArrCache['data']['queryResArrCache_key']['v'].length}`)
  console.log(`queryResArrCache['data']['queryResArrCache_key']['v'][0]==> ${queryResArrCache['data']['queryResArrCache_key']['v'][0]}`)
  console.log(`JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])==> ${JSON.stringify(queryResArrCache['data']['queryResArrCache_key']['v'][0])}`)
  //^// CACHE V_INVENTORYMASTER QUERY RESULTS IN BACKEND //////////////////////////////////////////////////////////////////////////////
}

export {
  rbDBqueryResults
}