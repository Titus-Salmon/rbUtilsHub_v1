<script>
  let catapultQueryText;
  let queryText = `
SELECT 
inv_ScanCode, ord_supplierstocknumber, inv_name, inv_size, inv_receiptalias, inv_datecreated, inv_default, ord_quantityinorderunit, oup_name, 
sto_number, brd_name, dpt_name, dpt_number, wgt_name, sib_idealMargin, ven_companyname, ven_code, asc_scancode, asc_receiptalias, asc_quantity, 
convert(varchar(10), inv_lastreceived, 120), convert(varchar(10), inv_lastsold, 120), inv_lastcost, sib_baseprice, inv_onhand, inv_onorder, 
inv_intransit, inv_memo, inv_discontinued, pi1_Description, pi2_Description, pi3_Description, pi4_Description, inv_powerfield1, inv_powerfield2, 
inv_powerfield3, inv_powerfield4 
FROM
catapult.ecrs.v_InventoryMaster 
WHERE trim(ven_companyname) IN ('EDI-ALOE')
AND trim(dpt_number) != '999999' ORDER BY dpt_name, pi1_Description, pi2_Description, inv_ScanCode, inv_discontinued`;
</script>

<div style="text-align:center">
  <textarea
    class="query"
    id="catapultQueryText"
    name="tblQryPost"
    cols="160"
    rows="18"
    wrap="soft"
    bind:this="{catapultQueryText}">
    {queryText}
  </textarea>
</div>
