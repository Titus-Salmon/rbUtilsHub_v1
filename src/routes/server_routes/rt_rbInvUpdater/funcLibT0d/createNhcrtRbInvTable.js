import { populateNhcrtRbInvTable } from "../funcLibT0d/populateNhcrtRbInvTable";

async function createNhcrtRbInvTable(createNhcrtRbInvTableQuery) {
  console.log(`hello from within createNhcrtRbInvTable()`);
  connection
    .query(createNhcrtRbInvTableQuery, function (error, response) {
      if (error) {
        console.log(`error from createNhcrtRbInvTable==> ${error}`);
      }
    })
    .on("end", function () {
      populateNhcrtRbInvTable(populateNhcrtRbInvTableQuery);
    });
}

export { createNhcrtRbInvTable };
