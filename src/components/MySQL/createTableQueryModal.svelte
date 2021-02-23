<script>
let mySqlQueryText;
let queryText = `CREATE TABLE tableName (ri_t0d int NOT NULL AUTO_INCREMENT, columnNamesAsCSV, PRIMARY KEY (ri_t0d));`;
</script>

<div style="text-align:center">
  <textarea
    class="query"
    id="mySqlQueryText"
    name="tblQryPost"
    cols="160"
    rows="15"
    wrap="soft"
    bind:this="{mySqlQueryText}">
    {queryText}
  </textarea>
</div>
