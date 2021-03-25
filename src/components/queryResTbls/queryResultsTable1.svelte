<script>
import tableData from "../../stores/dynamicTables/tableData1";
import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
import WsLogic from "./highlightLogic/wsLogic.svelte";
import RtlLogic from "./highlightLogic/rtlLogic.svelte";

console.log(`JSON.stringify($tableData)==> ${JSON.stringify($tableData)}`);
</script>

<style>
table {
  table-layout: fixed;
}
th {
  position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
}
</style>

<body>
  <table>
    <thead>
      <tr>
        {#each Object.keys($tableData[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#if $tableData[0]["charm"] && $tableData[0]["sib_baseprice"]}
        <RtlLogic />
      {:else if $tableData[0]["ediCostMod"] && $tableData[0]["lastCost"]}
        <WsLogic />
      {:else}
        {#each Object.values($tableData) as row}
          <tr>
            {#each Object.values(row) as cell}
              <td>{cell}</td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</body>
