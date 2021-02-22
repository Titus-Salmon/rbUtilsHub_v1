<script>
export let saveToCSVfileName;
export let saveToCSVresponse;
function saveToCSV() {
  fetch("server_routes/saveToCSV", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: saveToCSVfileName.value,
    }),
  })
    .then((saveToCSVresult) => saveToCSVresult.json())
    .then((saveToCSVresultJSON) => {
      console.log(
        `JSON.stringify(saveToCSVresultJSON)==> ${JSON.stringify(
          saveToCSVresultJSON
        )}`
      );
      saveToCSVresponse = saveToCSVresultJSON;
    });
}
</script>

<div>
  <div style="text-align:center">
    <label for="saveToCSV">File Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="saveToCSV"
      name="saveToCSV"
      bind:this="{saveToCSVfileName}" />
  </div>
  <div style="text-align:center">
    <button on:click="{saveToCSV}">saveToCSV</button>
  </div>
  <!-- <div>
    {#if saveToCSVresponse !== undefined}
      <p style="text-align:center; color: var(--element6)">
        {Object.values(saveToCSVresponse)}
      </p>
    {/if}
  </div> -->
</div>
