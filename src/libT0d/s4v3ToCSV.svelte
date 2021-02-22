<script>
let saveToCSVfileName;
function s4v3ToCSV() {
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
    <button on:click="{s4v3ToCSV}">saveToCSV</button>
  </div>
</div>
