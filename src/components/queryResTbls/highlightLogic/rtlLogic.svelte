<script>
import tableData from "../../../stores/dynamicTables/tableData1";
</script>

{#each $tableData as row}
  <tr>
    {#if Math.abs((row["charm"] - row["basePrice"]) / row["charm"]) > 0.5}
      {#each Object.keys(row) as colName}
        {#if colName === "charm"}
          <td style="background-color:#ff0000; color: black">{row[colName]}</td>
        {:else if colName === "basePrice"}
          <td style="background-color:#ff0000; color: black">{row[colName]}</td>
        {:else}
          <td>{row[colName]}</td>
        {/if}
      {/each}
    {/if}
    {#if Math.abs((row["charm"] - row["basePrice"]) / row["charm"]) > 0.35}
      {#each Object.keys(row) as colName}
        {#if colName === "charm"}
          <td style="background-color:#ffdb4b; color: black">{row[colName]}</td>
        {:else if colName === "basePrice"}
          <td style="background-color:#ffdb4b; color: black">{row[colName]}</td>
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
