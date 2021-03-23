<script>
let mySqlQueryText;
let queryText = `
SELECT 
edi_table.* 

nhcrt.ri_t0d, nhcrt.inv_ScanCode, nhcrt.ord_supplierstocknumber, nhcrt.inv_name, nhcrt.inv_size, nhcrt.inv_receiptalias, nhcrt.inv_datecreated, 
nhcrt.ord_quantityinorderunit, nhcrt.oup_name, nhcrt.sto_number, nhcrt.brd_name, nhcrt.dpt_name, nhcrt.dpt_number, nhcrt.sib_idealmargin, 
nhcrt.actlMarg, nhcrt.ven_companyname, nhcrt.ven_code, nhcrt.asc_scancode, nhcrt.asc_receiptalias, nhcrt.asc_quantity, nhcrt.inv_lastcost, 
nhcrt.sib_baseprice, nhcrt.pi1_description, nhcrt.pi2_description, nhcrt.pi3_description, nhcrt.inv_powerfield3, nhcrt.inv_powerfield4, 

FROM ediTableName

edi_table JOIN nhcrtTableName nhcrt 
ON edi_table.ediPrefix_upc 
WHERE edi_table.ediPrefix_upc = nhcrt.inv_ScanCode
OR edi_table.ediPrefix_upc = nhcrt.asc_scancode

ORDER BY nhcrt.dpt_name, nhcrt.pi1_description, nhcrt.pi1_description;`;
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
