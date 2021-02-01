<script>
let tableData = [];
</script>

<body>
  <table>
    <table>
      <thead>
        <tr>
          {#each Object.keys(tableData[0]) as columnHeading}
            <th>{columnHeading}</th>
          {/each}
        </tr><tr></tr>
      </thead>
    </table>
  </table>
</body>
