<script>
let mySqlQueryText;
let queryText = `DROP TABLE tableNamesAsCSV;`;
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
