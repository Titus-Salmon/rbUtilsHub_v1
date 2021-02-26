<script>
let mySqlQueryText;
let queryText = `
SELECT * 

FROM spins_data 

WHERE spins_upc REGEXP 

'751063150163|751063403009'`;
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
