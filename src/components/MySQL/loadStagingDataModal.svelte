<script>
  import stagingData from "../../stores/stagingData/st_stagingData.js";
  let tableName;
  let venCatPrefix; //the prefix for portal vendor catalog (i.e. gol for garden of life: gol_upc, etc...)
  let tableType;
  let loadStagingDataResponse;

  function loadStagingData() {
    fetch("server_routes/rt_MySQL/loadStagingData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tableName: tableName.value,
        venCatPrefix: venCatPrefix.value,
        tableType: tableType,
      }),
    })
      .then((loadStagingDataResult) => loadStagingDataResult.json())
      .then((loadStagingDataResultJSON) => {
        console.log(
          `JSON.stringify(loadStagingDataResultJSON)==> ${JSON.stringify(
            loadStagingDataResultJSON
          )}`
        );
        loadStagingDataResponse = loadStagingDataResultJSON;

        stagingData.set([{ stagingDataResponse: loadStagingDataResponse }]);

        // stagingData.update((currentData) => {
        //   currentData = [
        //     {
        //       stagingDataResponse: Object.values(loadStagingDataResponse),
        //     },
        //   ];
        //   return currentData;
        // });
      });
  }
</script>

<div style="padding: 0 1rem">
  <div class="flexbox">
    <!-- //////////////table name//////////////////////////// -->
    <div style="text-align:center;">
      <label for="tableName">Table Name</label>
    </div>
    <div style="text-align:center">
      <input
        type="text"
        id="tableName"
        name="tableName"
        required
        bind:this="{tableName}" />
    </div>
    <!-- //////////////table type//////////////////////////// -->
    <div style="text-align:center">
      <label for="tableType">Table type</label>
      <select name="tableType" id="tableType" bind:value="{tableType}">
        <option value="edi">EDI</option>
        <option value="pprv_edi">pprv_edi</option>
        <option value="pprv">pprv</option>
        <option value="other">Other</option>
      </select>
    </div>
  </div>

  <!-- //////////////vendor catalog prefix//////////////////////////// -->
  <div style="text-align:center;">
    <label for="venPrefix">Vendor Catalog Prefix</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="venPrefix"
      name="venPrefix"
      required
      bind:this="{venCatPrefix}" />
  </div>
  <!-- //////////////button//////////////////////////// -->
  <div style="text-align:center">
    <button on:click="{loadStagingData}">loadStagingData</button>
  </div>
</div>
