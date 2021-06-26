import { calcResRbInvUpdater } from "../funcLibT0d/calcResRbInvUpdater";

async function populateNhcrtRbInvTable(populateNhcrtRbInvTableQuery) {
  connection
    .query(populateNhcrtRbInvTableQuery, function (error, response) {
      if (error) {
        console.log(`error from populateNhcrtRbInvTable==> ${error}`);
      }
    })
    .on("end", function () {
      calcResRbInvUpdater();
    });
}

export { populateNhcrtRbInvTable };
