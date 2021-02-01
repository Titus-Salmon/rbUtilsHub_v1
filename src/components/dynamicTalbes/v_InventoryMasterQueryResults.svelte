<script>
// let tableData = [];
import tableData from "../dynamicTalbes/tableStores/tableData1.js";
tableData.subscribe((tableData_t0d) =>
  console.log(`tableData_t0d=> ${tableData_t0d}`)
);
</script>

<body>
  <table>
    <table>
      <thead>
        <tr>
          {#if Object.keys(tableData[0]) !== undefined && Object.keys(tableData[0]) !== null}
            {#each Object.keys(tableData[0][0]) as columnHeading}
              <th>{columnHeading}</th>
            {/each}
          {/if}
        </tr><tr></tr>
      </thead>
    </table>
  </table>
</body>
