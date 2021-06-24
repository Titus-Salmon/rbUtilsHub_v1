<script>
  import rbInvUpdaterAuditResTblData from "../../stores/dynamicTables/st_rbInvUpdaterAuditResTbl";
  import { onMount, onDestroy, beforeUpdate, afterUpdate } from "svelte";
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
        {#each Object.keys($rbInvUpdaterAuditResTblData.rbInvJoinArr_ind[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#each Object.values($rbInvUpdaterAuditResTblData.rbInvJoinArr_ind) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        {#each Object.keys($rbInvUpdaterAuditResTblData.rbInvJoinArr_sm[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#each Object.values($rbInvUpdaterAuditResTblData.rbInvJoinArr_sm) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        {#each Object.keys($rbInvUpdaterAuditResTblData.rbInvJoinArr_mt[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#each Object.values($rbInvUpdaterAuditResTblData.rbInvJoinArr_mt) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        {#each Object.keys($rbInvUpdaterAuditResTblData.rbInvJoinArr_sh[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#each Object.values($rbInvUpdaterAuditResTblData.rbInvJoinArr_sh) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>

  <table>
    <thead>
      <tr>
        {#each Object.keys($rbInvUpdaterAuditResTblData.rbInvJoinArr_gl[0]) as columnHeading}
          <th>{columnHeading}</th>
        {/each}
      </tr>
    </thead>
    <tbody id="rsltTblBdy">
      {#each Object.values($rbInvUpdaterAuditResTblData.rbInvJoinArr_gl) as row}
        <tr>
          {#each Object.values(row) as cell}
            <td>{cell}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</body>
