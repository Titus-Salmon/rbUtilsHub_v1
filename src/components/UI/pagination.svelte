<script>
import { onMount } from "svelte";
import paginData from "../../stores/pagination/st_pagination1.js";
import tableData from "../../stores/dynamicTables/tableData1.js";

// let pageToDisplay;
let paginData_t0d = $paginData;
// // let forward;
// // let reverse;

// function paginate(direction) {
//   if (typeof $paginData.totalPages === "number") {
//     console.log(`$paginData==> ${$paginData}`);
//     console.log(`Object.keys($paginData)1==> ${Object.keys($paginData)}`);
//     console.log(`Object.values($paginData)1==> ${Object.values($paginData)}`);

//     if (direction === "forward") {
//       pageToDisplay = $paginData.currentPage + 1;
//     }
//     if (direction === "reverse") {
//       pageToDisplay = $paginData.currentPage - 1;
//     }

//     fetch(`server_routes/pagination/rt_pagination?page=${pageToDisplay}`, {
//       method: "GET",
//     })
//       .then((queryRes) => queryRes.json())
//       .then((queryResJSON) => {
//         console.log(`queryResJSON from pagination.svelte==> ${queryResJSON}`);
//         console.log(
//           `JSON.stringify(queryResJSON) from pagination.svelte==> ${JSON.stringify(
//             queryResJSON
//           )}`
//         );
//         tableData.set(queryResJSON.catapultResArr_pagin); //passing backend response to frontend "Store"
//         //& we are overwriting the "Store" with set()
//         paginData.set({
//           currentPage: queryResJSON.currentPage,
//           nextPage: queryResJSON.nextPage,
//           prevPage: queryResJSON.prevPage,
//         }); //passing backend response to frontend "Store"
//         //& we are overwriting the "Store" with set()

//         console.log(`Object.keys($paginData)2==> ${Object.keys($paginData)}`);
//         console.log(
//           `Object.values($paginData)2==> ${Object.values($paginData)}`
//         );
//       });
//     //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
//     //and at that point we can use this JSON object to do whatever with, such as stringify it, or
//     //display it in a table on the frontend
//   }
// }
</script>

<style>
</style>

<!-- <body> -->
<!--v-- NOTE: you must use the $ to access the paginData store -->
<!-- {#if paginData_t0d !== undefined} -->
<p>JSON.stringify(paginData_t0d)==> {JSON.stringify(paginData_t0d)}</p>
<p>paginData_t0d[0].totalPages==> {paginData_t0d[0].totalPages}</p>
<p>paginData_t0d[0].currentPage==> {paginData_t0d[0].currentPage}</p>
<p>paginData_t0d[0].nextPage==> {paginData_t0d[0].nextPage}</p>
<p>paginData_t0d[0].prevPage==> {paginData_t0d[0].prevPage}</p>
<!-- {/if} -->
<!-- </body> -->
