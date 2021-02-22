<script>
import utilResponses from "../stores/utilResponses/st_utilResponses";
let saveToXLSXfileName;
let saveToXLSXresponse;

function saveToXLSX() {
  fetch("server_routes/saveToXLSX", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: saveToXLSXfileName.value,
    }),
  })
    .then((saveToXLSXresult) => saveToXLSXresult.json())
    .then((saveToXLSXresultJSON) => {
      console.log(
        `JSON.stringify(saveToXLSXresultJSON)==> ${JSON.stringify(
          saveToXLSXresultJSON
        )}`
      );
      saveToXLSXresponse = saveToXLSXresultJSON;
      utilResponses.set([{ utilResponse: saveToXLSXresponse }]);
    });
}
</script>

<div>
  <div style="text-align:center">
    <label for="saveToXLSX">File Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="saveToXLSX"
      name="saveToXLSX"
      bind:this="{saveToXLSXfileName}" />
  </div>
  <div style="text-align:center">
    <button on:click="{saveToXLSX}">saveToXLSX</button>
  </div>
</div>
