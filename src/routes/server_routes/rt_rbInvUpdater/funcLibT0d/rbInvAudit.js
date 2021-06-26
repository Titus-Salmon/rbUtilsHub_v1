async function rbInvAudit() {
  let rbInvJoinArr_ind = [];
  let rbInvJoinArr_sm = [];
  let rbInvJoinArr_mt = [];
  let rbInvJoinArr_sh = [];
  let rbInvJoinArr_gl = [];

  let searchResults = []; //clear searchResults from previous search

  let searchResultsSplitParsedArr = [];

  let saniRegex1 = /(\[)|(\])/g;
  let saniRegex2 = /""/g;

  /* X(?=Y) 	Positive lookahead 	X if followed by Y
   * (?<=Y)X 	Positive lookbehind 	X if after Y
   * ==t0d==>you can combine the 2==> (?<=A)X(?=B) to yield: "X if after A and followed by B" <==t0d==*/
  let splitRegex1 = /(?<=}),(?={)/g;

  function displayRbInvJoin(rows) {
    let indRows = rows[0];
    let smRows = rows[1];
    let mtRows = rows[2];
    let shRows = rows[3];
    let glRows = rows[4];

    for (let i = 0; i < indRows.length; i++) {
      let rbInvJoinObj_ind = {};
      rbInvJoinObj_ind["ri_t0dIND"] = i + 1;
      rbInvJoinObj_ind["new_inv_upcIND"] = indRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_ind["new_inv_nameIND"] = indRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_ind["new_inv_in_stockIND"] = indRows[i]["new_inv_in_stock"];
      rbInvJoinObj_ind["old_inv_in_stockIND"] = indRows[i]["old_inv_in_stock"];
      rbInvJoinArr_ind.push(rbInvJoinObj_ind);
    }

    for (let i = 0; i < smRows.length; i++) {
      let rbInvJoinObj_sm = {};
      rbInvJoinObj_sm["ri_t0dSM"] = i + 1;
      rbInvJoinObj_sm["new_inv_upcSM"] = smRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_sm["new_inv_nameSM"] = smRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_sm["new_inv_sm_stockSM"] = smRows[i]["new_inv_sm_stock"];
      rbInvJoinObj_sm["old_inv_sm_stockSM"] = smRows[i]["old_inv_sm_stock"];
      rbInvJoinArr_sm.push(rbInvJoinObj_sm);
    }

    for (let i = 0; i < mtRows.length; i++) {
      let rbInvJoinObj_mt = {};
      rbInvJoinObj_mt["ri_t0dMT"] = i + 1;
      rbInvJoinObj_mt["new_inv_upcMT"] = mtRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_mt["new_inv_nameMT"] = mtRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_mt["new_inv_mt_stockMT"] = mtRows[i]["new_inv_mt_stock"];
      rbInvJoinObj_mt["old_inv_mt_stockMT"] = mtRows[i]["old_inv_mt_stock"];
      rbInvJoinArr_mt.push(rbInvJoinObj_mt);
    }

    for (let i = 0; i < shRows.length; i++) {
      let rbInvJoinObj_sh = {};
      rbInvJoinObj_sh["ri_t0dSH"] = i + 1;
      rbInvJoinObj_sh["new_inv_upcSH"] = shRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_sh["new_inv_nameSH"] = shRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_sh["new_inv_sh_stockSH"] = shRows[i]["new_inv_sh_stock"];
      rbInvJoinObj_sh["old_inv_sh_stockSH"] = shRows[i]["old_inv_sh_stock"];
      rbInvJoinArr_sh.push(rbInvJoinObj_sh);
    }

    for (let i = 0; i < glRows.length; i++) {
      let rbInvJoinObj_gl = {};
      rbInvJoinObj_gl["ri_t0dGL"] = i + 1;
      rbInvJoinObj_gl["new_inv_upcGL"] = glRows[i]["new_inv_upc"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_gl["new_inv_nameGL"] = glRows[i]["new_inv_name"]; //could use smRows[i], mtRows[i], etc. here, since they're all the same
      rbInvJoinObj_gl["new_inv_gl_stockGL"] = glRows[i]["new_inv_gl_stock"];
      rbInvJoinObj_gl["old_inv_gl_stockGL"] = glRows[i]["old_inv_gl_stock"];
      rbInvJoinArr_gl.push(rbInvJoinObj_gl);
    }

    rbInvJoinArr_indSani = JSON.stringify(rbInvJoinArr_ind)
      .replace(saniRegex2, `"EMPTY"`)
      .replace(saniRegex1, "");
    rbInvJoinArr_smSani = JSON.stringify(rbInvJoinArr_sm)
      .replace(saniRegex2, `"EMPTY"`)
      .replace(saniRegex1, "");
    rbInvJoinArr_mtSani = JSON.stringify(rbInvJoinArr_mt)
      .replace(saniRegex2, `"EMPTY"`)
      .replace(saniRegex1, "");
    rbInvJoinArr_shSani = JSON.stringify(rbInvJoinArr_sh)
      .replace(saniRegex2, `"EMPTY"`)
      .replace(saniRegex1, "");
    rbInvJoinArr_glSani = JSON.stringify(rbInvJoinArr_gl)
      .replace(saniRegex2, `"EMPTY"`)
      .replace(saniRegex1, "");

    searchResults.push(
      rbInvJoinArr_indSani,
      rbInvJoinArr_smSani,
      rbInvJoinArr_mtSani,
      rbInvJoinArr_shSani,
      rbInvJoinArr_glSani
    );
    console.log(`searchResults[0]==> ${searchResults[0]}`);
    let searchResultsToString = searchResults.toString();
    searchResultsSplit = searchResultsToString.split(splitRegex1);
    console.log(`searchResultsSplit.length==> ${searchResultsSplit.length}`);
    console.log(`searchResultsSplit[0]==> ${searchResultsSplit[0]}`);
    console.log(
      `typeof searchResultsSplit[0]==> ${typeof searchResultsSplit[0]}`
    );
    console.log(
      `typeof JSON.parse(searchResultsSplit[0])==> ${typeof JSON.parse(
        searchResultsSplit[0]
      )}`
    );

    for (let k = 0; k < searchResultsSplit.length; k++) {
      let searchResultsSplitParsed = JSON.parse(searchResultsSplit[k]);
      searchResultsSplitParsedArr.push(searchResultsSplitParsed);
    }
    console.log(
      `searchResultsSplitParsedArr[0]['ri_t0dIND']==> ${searchResultsSplitParsedArr[0]["ri_t0dIND"]}`
    );
  }

  connection.query(
    `
  SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_in_stock AS new_inv_in_stock,
  orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_in_stock AS old_inv_in_stock
  FROM rb_inventory_test updated
  JOIN rb_inventory_test_old orig ON updated.inv_upc
  WHERE updated.inv_upc = orig.inv_upc
  AND updated.inv_in_stock != orig.inv_in_stock
  ORDER BY updated.inv_in_stock, orig.inv_in_stock;
  
  SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_sm_stock AS new_inv_sm_stock,
  orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_sm_stock AS old_inv_sm_stock
  FROM rb_inventory_test updated
  JOIN rb_inventory_test_old orig ON updated.inv_upc
  WHERE updated.inv_upc = orig.inv_upc
  AND updated.inv_sm_stock != orig.inv_sm_stock
  ORDER BY updated.inv_sm_stock, orig.inv_sm_stock;
  
  SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_mt_stock AS new_inv_mt_stock,
  orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_mt_stock AS old_inv_mt_stock
  FROM rb_inventory_test updated
  JOIN rb_inventory_test_old orig ON updated.inv_upc
  WHERE updated.inv_upc = orig.inv_upc
  AND updated.inv_mt_stock != orig.inv_mt_stock
  ORDER BY updated.inv_mt_stock, orig.inv_mt_stock;
  
  SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_sh_stock AS new_inv_sh_stock,
  orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_sh_stock AS old_inv_sh_stock
  FROM rb_inventory_test updated
  JOIN rb_inventory_test_old orig ON updated.inv_upc
  WHERE updated.inv_upc = orig.inv_upc
  AND updated.inv_sh_stock != orig.inv_sh_stock
  ORDER BY updated.inv_sh_stock, orig.inv_sh_stock;
  
  SELECT updated.inv_upc AS new_inv_upc, updated.inv_name AS new_inv_name, updated.inv_gl_stock AS new_inv_gl_stock,
  orig.inv_upc AS old_inv_upc, orig.inv_name AS old_inv_name, orig.inv_gl_stock AS old_inv_gl_stock
  FROM rb_inventory_test updated
  JOIN rb_inventory_test_old orig ON updated.inv_upc
  WHERE updated.inv_upc = orig.inv_upc
  AND updated.inv_gl_stock != orig.inv_gl_stock
  ORDER BY updated.inv_gl_stock, orig.inv_gl_stock;`,
    function (err, rows, fields) {
      if (err) throw err;
      displayRbInvJoin(rows);

      res.json({
        auditResObj: {
          rbInvJoinArr_ind: rbInvJoinArr_ind,
          rbInvJoinArr_sm: rbInvJoinArr_sm,
          rbInvJoinArr_mt: rbInvJoinArr_mt,
          rbInvJoinArr_sh: rbInvJoinArr_sh,
          rbInvJoinArr_gl: rbInvJoinArr_gl,
        },
      });
    }
  );
}

export { rbInvAudit };