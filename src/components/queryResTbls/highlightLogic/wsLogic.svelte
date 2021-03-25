<script>
import tableData from "../../../stores/dynamicTables/tableData1";
</script>

{#each $tableData as row}
  <tr>
    {#if Math.abs((row["ediCostMod"] - row["lastCost"]) / row["ediCostMod"]) > 0.35 && Math.abs((row["ediCostMod"] - row["lastCost"]) / row["ediCostMod"]) < 0.5}
      {#each Object.keys(row) as colName}
        {#if colName === "ediCostMod" || colName === "lastCost"}
          <td style="background-color:#ffb3ca; color: black">{row[colName]}</td>
        {:else}
          <td>{row[colName]}</td>
        {/if}
      {/each}
    {/if}
    {#if Math.abs((row["ediCostMod"] - row["lastCost"]) / row["ediCostMod"]) >= 0.5}
      {#each Object.keys(row) as colName}
        {#if colName === "ediCostMod" || colName === "lastCost"}
          <td style="background-color:#ff8533; color: black">{row[colName]}</td>
        {:else}
          <td>{row[colName]}</td>
        {/if}
      {/each}
    {:else}
      {#each Object.values(row) as cell}
        <td>{cell}</td>
      {/each}
    {/if}
  </tr>
{/each}
