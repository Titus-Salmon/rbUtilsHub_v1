<script>
  let catapultQueryText;
  let queryText = `
select
si.inv_pk, si.inv_cpk, si.inv_scancode,
pow.POW_PK, pow.POW_ReceiveDate, pow.POW_InvoiceNumber, pow.POW_STO_FK_Receive,
sto.sto_pk, sto.sto_number as stores_sto_number,
pod.POD_POW_FK, pod.POD_INV_FK, pod.POD_INV_CFK, pod.POD_OrderQuantity, pod.POD_ReceiveQuantity, pod.POD_ReceiveCost, pod.POD_ORDQuantity, 
pod.POD_ASCQuantity, pod.POD_Received, pod.POD_BackOrder, pod.POD_CommitCost, pod.POD_CommitRetail, pod.POD_Timestamp, pod.POD_PkgCost, 
pod.POD_OriginalReceiveCost, pod.POD_TotalCommittedCost, pod.POD_OriginalTotalCommittedCost, pod.POD_PreFreightTotalCommittedCost, 
pod.POD_PreDiscountTotalCommittedCost, pod.POD_ApplyDiscount, pod.POD_TotalCost, pod.POD_CostUpdateSource, pod.POD_ShipQuantity, 
pod.POD_Verified, pod.POD_PkgCharges, pod.POD_UnitCharges, pod.POD_TotalCharges, pod.POD_PkgOrderCost, pod.POD_UnitOrderCost, 
pod.POD_TotalOrderCost, pod.POD_CommitOnHand, pod.POD_CommitDivider, 
vim.inv_scancode, vim.ord_supplierstocknumber, vim.inv_receiptalias, vim.asc_scancode, vim.asc_receiptalias, vim.asc_quantity, vim.inv_lastcost, 
vim.sib_baseprice, vim.ven_companyname, vim.dpt_name, vim.dpt_number, vim.oup_name, vim.brd_name, vim.inv_size, vim.sto_number, 
vim.inv_discontinued, vim.pi1_description, vim.pi2_description
from catapult.ecrs.PurchaseOrderWorksheetData pod
left join catapult.ecrs.PurchaseOrderWorksheet pow on trim(pow.pow_pk) = trim(pod.pod_pow_fk)
left join catapult.ecrs.Stores sto on trim(sto.sto_pk) = trim(pow.pow_sto_fk_receive)
left join catapult.ecrs.StockInventory si on trim(si.inv_pk) = trim(pod.pod_inv_fk) and trim(si.inv_cpk) = trim(pod.pod_inv_cfk)
left join catapult.ecrs.v_inventorymaster vim on trim(vim.inv_scancode) = trim(si.inv_scancode)
where trim(pod.POD_TimeStamp) > '2021-07-17'
and trim(pow.POW_ReceiveDate) > '2021-07-17'
and trim(vim.ven_companyname) = 'EDI-KEHE' 
and trim(pod.pod_received) = '1' 
order by pod.pod_received, pow.POW_ReceiveDate, pow.POW_InvoiceNumber, vim.ven_companyname, vim.inv_scancode, vim.pi1_description, 
vim.pi2_description`;
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
