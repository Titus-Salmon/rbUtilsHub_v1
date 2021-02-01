<script>
// let tableData = [];
import tableData from "../dynamicTalbes/tableStores/tableData1.js";
tableData.subscribe((tableData_t0d) => {
  console.log(`tableData_t0d=> ${tableData_t0d}`);
  console.log(`typeof tableData_t0d=> ${typeof tableData_t0d}`);
  console.log(`Object.keys(tableData_t0d)=> ${Object.keys(tableData_t0d)}`);
  let ObKeysTableDataT0d = Object.keys(tableData_t0d);
  console.log(`typeof ObKeysTableDataT0d=> ${typeof ObKeysTableDataT0d}`);
});
</script>

<body>
  <table>
    <table>
      <thead>
        <tr>
          {#if tableData !== undefined && tableData !== null && tableData !== ""}
            {#each Object.keys(tableData[0][0]) as columnHeading}
              <th>{columnHeading}</th>
            {/each}
          {/if}
        </tr><tr></tr>
      </thead>
    </table>
  </table>
</body>
