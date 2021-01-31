<script>
  import { onMount } from 'svelte';

  let data;
  onMount(async () => {
    data = await fetch('http://localhost:3333/tsqlHub')
      .then((x) => x)
      .then(console.log(`x==> ${x}`));
  });

  // onMount(async () => {
  //   const res = await fetch(`http://localhost:3333/tsqlHub`, {
  //     //mode: 'cors',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       //'Access-Control-Allow-Origin': '*',
  //     },
  //   });
  //   let frontendCatapultResArr = await res;
  //   console.log(`frontendCatapultResArr==> ${frontendCatapultResArr}`);
  //   console.log(
  //     `JSON.stringify(frontendCatapultResArr)==> ${JSON.stringify(
  //       frontendCatapultResArr
  //     )}`
  //   );
  // });

  function vInvMasterQuery() {
    fetch('v_InventoryMasterQuery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': '*',
      },
      //mode: 'cors',
      body: JSON.stringify({
        data: `SELECT INV_PK, INV_CPK, INV_ScanCode, ORD_SupplierStockNumber, INV_Name,
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
      }),
    });
  }
</script>

<body>
  <button on:click={vInvMasterQuery}>vInvMasterQuery</button>

  <table>
    <table>
      <thead>
        <tr>
          <!-- {#each Object.keys(frontendCatapultResArr[0]) as columnHeading}
            <th>{columnHeading}</th>
          {/each} -->
        </tr><tr />
      </thead>
    </table>
  </table></body
>

<style>
  body {
    background-color: black;
  }
</style>
