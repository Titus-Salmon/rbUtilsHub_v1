<script>
let mySqlQueryText;
let queryText = `
SELECT * 
FROM edi_vendorname_data 
WHERE prefix_upc NOT IN
(SELECT inv_ScanCode from nhcrtVendorYYYYMMDD);`;
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
