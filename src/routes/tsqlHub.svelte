<script>
  function vInvMasterQuery() {
    fetch('v_InventoryMasterQuery_test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: 'it works' }),
      // headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      // body: `SELECT INV_PK, INV_CPK, INV_ScanCode, ORD_SupplierStockNumber, INV_Name,
      //   INV_Size, INV_ReceiptAlias, inv_default, convert(varchar(10),
      //   POS_TimeStamp, 120), INV_DateCreated, INV_EMP_FK_CreatedBy,
      //   ord_quantityinorderunit, oup_name, sto_number, dpt_name, dpt_number,
      //   SIB_IdealMargin, ven_companyname, convert(varchar(10), inv_lastreceived,
      //   120), convert(varchar(10), inv_lastsold, 120), inv_lastcost,
      //   SIB_BasePrice, inv_onhand, inv_onorder, inv_intransit, inv_memo,
      //   PI1_Description, PI2_Description, PI3_Description, PI4_Description,
      //   INV_PowerField1, INV_PowerField2, INV_PowerField3, INV_PowerField4 FROM
      //   catapult.ecrs.v_InventoryMaster WHERE trim(ven_companyname) IN
      //   ('EDI-ALOE') AND trim(dpt_number) != '999999' ORDER BY PI1_Description,
      //   PI2_Description`,
    });
  }
</script>

<button on:click={vInvMasterQuery}>vInvMasterQuery</button>

<!--<script>
  function vInvMasterQuery() {
    fetch('v_InventoryMasterQuery', {
      method: 'POST',
      headers: { 'Content-type': 'text/plain;charset=UTF-8' },
      body: `SELECT INV_PK, INV_CPK, INV_ScanCode, ORD_SupplierStockNumber, INV_Name,
        INV_Size, INV_ReceiptAlias, inv_default, convert(varchar(10),
        POS_TimeStamp, 120), INV_DateCreated, INV_EMP_FK_CreatedBy,
        ord_quantityinorderunit, oup_name, sto_number, dpt_name, dpt_number,
        SIB_IdealMargin, ven_companyname, convert(varchar(10), inv_lastreceived,
        120), convert(varchar(10), inv_lastsold, 120), inv_lastcost,
        SIB_BasePrice, inv_onhand, inv_onorder, inv_intransit, inv_memo,
        PI1_Description, PI2_Description, PI3_Description, PI4_Description,
        INV_PowerField1, INV_PowerField2, INV_PowerField3, INV_PowerField4 FROM
        catapult.ecrs.v_InventoryMaster WHERE trim(ven_companyname) IN
        ('EDI-ALOE') AND trim(dpt_number) != '999999' ORDER BY PI1_Description,
        PI2_Description`,
    });
  }
</script><button on:click={vInvMasterQuery}>vInvMasterQuery</button> -->

<!-- <div style="display:block">
  <form
    id="queryInvMasterTable"
    action="http://localhost:3333/tsqlHub/queryInvMasterTable"
    method="POST"
    accept-charset="UTF-8"
    style="display:block"
  >
    <div style="display:block">
      <label for="query">Enter Query for Catapult v_InventoryMaster</label>
      <textarea id="query" name="tblQryPost" cols="30" rows="1" wrap="soft">
        SELECT INV_PK, INV_CPK, INV_ScanCode, ORD_SupplierStockNumber, INV_Name,
        INV_Size, INV_ReceiptAlias, inv_default, convert(varchar(10),
        POS_TimeStamp, 120), INV_DateCreated, INV_EMP_FK_CreatedBy,
        ord_quantityinorderunit, oup_name, sto_number, dpt_name, dpt_number,
        SIB_IdealMargin, ven_companyname, convert(varchar(10), inv_lastreceived,
        120), convert(varchar(10), inv_lastsold, 120), inv_lastcost,
        SIB_BasePrice, inv_onhand, inv_onorder, inv_intransit, inv_memo,
        PI1_Description, PI2_Description, PI3_Description, PI4_Description,
        INV_PowerField1, INV_PowerField2, INV_PowerField3, INV_PowerField4 FROM
        catapult.ecrs.v_InventoryMaster WHERE trim(ven_companyname) IN
        ('EDI-ALOE') AND trim(dpt_number) != '999999' ORDER BY PI1_Description,
        PI2_Description
      </textarea>
      <button
        type="submit"
        form="queryInvMasterTable"
        style="display:block; float:left">vInvMasterQuery</button
      >
    </div>
  </form>
</div> -->
