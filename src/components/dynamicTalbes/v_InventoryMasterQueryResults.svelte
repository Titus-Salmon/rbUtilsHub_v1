<script>
// let tableData = [];
import tableData from "../dynamicTalbes/tableStores/tableData1.js";
let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
console.log(`table_data==> ${table_data}`);
</script>

<style>
:global(main.dark-mode) {
  background-color: #0084f6;
  color: white;
}
</style>

<body>
  <table>
    <table>
      <thead>
        <tr>
          {#if table_data !== undefined && table_data !== null && table_data !== ""}
            {#each Object.keys(table_data[0]) as columnHeading}
              <th>{columnHeading}</th>
            {/each}
          {/if}
        </tr>
      </thead>
      <tbody>
        {#each Object.values(table_data) as row}
          <tr>
            {#each Object.values(row) as cell}
              <td>{cell}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </table>
</body>
