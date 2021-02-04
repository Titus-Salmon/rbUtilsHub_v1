<script>
// let tableData = [];
import tableData from "../dynamicTalbes/tableStores/tableData1.js";
let table_data;
tableData.subscribe((tableData_t0d) => (table_data = tableData_t0d));
console.log(`table_data==> ${table_data}`);
</script>

<style>
/* :global(body) {
  background-color: #f2eee2;
  color: #0084f6;
  transition: background-color 0.3s;
}
:global(body.dark-mode) {
  background-color: #1d3040;
  color: #bfc2c7;
} */
</style>

<body class="dark-mode">
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
