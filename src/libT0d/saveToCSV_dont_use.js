module.exports = {
  saveToCSV: function () {
    console.log(`h444444444444ll0 from v1th1n saveToCSV_dont_use`)
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
}