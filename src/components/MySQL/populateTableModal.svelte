<script>
import utilResponses from "../../stores/utilResponses/st_utilResponses";
let popTableFile;
let popTableTableName;
let popTableResponse;

// const formData = new FormData();
// formData.append("popTableTableName", popTableTableName);
// formData.append("popTableFile", popTableFile);

// console.log(`formData==> ${formData}`);
// console.log(`JSON.stringify(formData)==> ${JSON.stringify(formData)}`);

function upload() {
  const formData = new FormData();
  formData.append("damName", value);
  formData.append("dataFile", files[0]);
  const upload = fetch("http://localhost:8080/file", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function popTable() {
  const formData = new FormData();
  formData.append("popTableTableName", popTableTableName.value);
  formData.append("popTableFile", popTableFile.files[0]);

  // console.log(`formData==> ${formData}`);
  // console.log(`JSON.stringify(formData)==> ${JSON.stringify(formData)}`);

  fetch("server_routes/rt_MySQL/popTable", {
    method: "POST",
    // headers: {
    //   "Content-Type": "application/json",
    // },
    // body: JSON.stringify({
    //   popTableFile: popTableFile.value,
    //   popTableTableName: popTableTableName.value,
    // }),
    body: formData,
  })
    .then(
      console.log(`JSON.stringify(formData)==> ${JSON.stringify(formData)}`)
    )
    .then((popTableResult) => popTableResult.json())
    .then((popTableResultJSON) => {
      console.log(
        `JSON.stringify(popTableResultJSON)==> ${JSON.stringify(
          popTableResultJSON
        )}`
      );
      popTableResponse = popTableResultJSON;

      utilResponses.set([{ utilResponse: popTableResponse }]);

      // utilResponses.update((currentData) => {
      //   currentData = [
      //     {
      //       utilResponse: Object.values(popTableResponse),
      //     },
      //   ];
      //   return currentData;
      // });
    });
}
</script>

<!-- <form
  id="popTable"
  name="popTable"
  method="POST"
  encType="multipart/form-data"
  accept-charset="UTF-8">
  <div style="text-align:center">
    <label for="popTableTableName">Table Name:</label>
    <input type="text" id="popTableTableName" name="popTableTableName" />
  </div>
  <div style="text-align:center">
    <label for="popTableFile">Upload file:</label>
    <input type="file" id="popTableFile" name="popTableFile" />
  </div>
  <div style="text-align:center">
    <button type="submit" form="popTable" on:click="{popTable}"
      >popTable</button>
  </div>
</form> -->

<div>
  <div style="text-align:center">
    <label for="popTableFile">File Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="file"
      id="popTableFile"
      name="popTableFile"
      bind:files="{popTableFile}" />
  </div>
  <div style="text-align:center">
    <label for="popTableTableName">Table Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="popTableTableName"
      name="popTableTableName"
      bind:value="{popTableTableName}" />
  </div>
  <div style="text-align:center">
    <button on:click="{popTable}">popTable</button>
  </div>
</div>
