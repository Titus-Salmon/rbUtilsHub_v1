<script>
import utilResponses from "../../stores/utilResponses/st_utilResponses";
let popTableFile;
let popTableTableName;
let popTableResponse;

// let files;
// let statusCode = "";

// async function handleSubmit() {
//   if (files.length > 0) {
//     const formData = new FormData();
//     formData.append("file", files[0]);
//     const response = await fetch("/gateway/media_objects", {
//       method: "POST",
//       body: formData,
//     });
//     statusCode = response.status;
//   }
// }

function popTable() {
  if (popTableFile.length > 0) {
    const formData = new FormData();
    formData.append("popTableTableName", popTableTableName.value);
    formData.append("popTableFile", popTableFile[0]);

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
}
</script>

<div>
  <div style="text-align:center">
    <label for="popTableFile">File Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="file"
      id="popTableFile"
      name="popTableFile"
      bind:this="{popTableFile}" />
  </div>
  <div style="text-align:center">
    <label for="popTableTableName">Table Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="popTableTableName"
      name="popTableTableName"
      bind:this="{popTableTableName}" />
  </div>
  <div style="text-align:center">
    <button on:click="{popTable}">popTable</button>
  </div>
</div>
