<script>
let mySqlQueryText;
let queryText = `
SELECT * FROM ${frmInptsObj.formInput0}
WHERE dptName != 'RB_CLEANUP' 
GROUP BY ${genericHeaderObj.upcHeader}, ${genericHeaderObj.invLastcostHeader} 
ORDER BY
${genericHeaderObj.rbDeptHeader} ASC, ${genericHeaderObj.pi1Description} ASC, ${genericHeaderObj.pi2Description} ASC
LIMIT ${paginPostObj["offsetPost"]},${paginPostObj["numQueryRes"]};

SELECT * FROM rb_edlp_data;
      
SELECT * FROM ${frmInptsObj.formInput0}
WHERE dptName != 'RB_CLEANUP' GROUP BY ${genericHeaderObj.upcHeader},${genericHeaderObj.invLastcostHeader} 
ORDER BY
${genericHeaderObj.rbDeptHeader} ASC, ${genericHeaderObj.pi1Description} ASC, ${genericHeaderObj.pi2Description} ASC;
      
SELECT COUNT(*) FROM ${frmInptsObj.formInput0};
      
SELECT * FROM gpet_groc;
SELECT * FROM gpet_ref;
SELECT * FROM gpet_frz;
SELECT * FROM gpet_gen_merch;
SELECT * FROM gpet_infra;
SELECT * FROM gpet_case_stack;
SELECT * FROM gpet_nego_edlp;
SELECT * FROM gpet_cadia;`;
</script>

<div style="text-align:center">
  <textarea
    class="query"
    id="mySqlQueryText"
    name="tblQryPost"
    cols="160"
    rows="18"
    wrap="soft"
    bind:this="{mySqlQueryText}">
    {queryText}
  </textarea>
</div>
