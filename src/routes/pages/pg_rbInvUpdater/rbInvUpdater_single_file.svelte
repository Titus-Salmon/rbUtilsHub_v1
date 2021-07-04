<script>
  import { onMount, onDestroy } from "svelte";

  import rbInvUpdaterAuditResTblData from "../../../stores/dynamicTables/st_rbInvUpdaterAuditResTbl";
  import RbInvUpdaterAuditResTbl from "../../../components/rbInvUpdaterAuditResTables/rbInvUpdaterAuditResTbl.svelte";

  let initialQueryText;

  let initialQuery = `
  SELECT inv_upc FROM rb_inventory_test;
  `;
  function rbInvUpdater() {
    fetch("server_routes/rt_rbInvUpdater/rbInvUpdater_single_file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initialQueryText: initialQueryText.value,
      }),
    })
      .then((auditRes) => auditRes.json())
      .then((auditResJSON) => {
        rbInvUpdaterAuditResTblData.set(auditResJSON.auditResObj);
        console.log(
          `JSON.stringify(auditResJSON.auditResObj)==> ${JSON.stringify(
            auditResJSON.auditResObj
          )}`
        ); //passing backend response to frontend "Store" & we are overwriting the "Store" with set()
        // paginData.update((currentData) => {
        //   currentData = [
        //     {
        //       totalPages: queryResJSON.totalPages,
        //       currentPage: queryResJSON.currentPage,
        //       nextPage: queryResJSON.nextPage,
        //       prevPage: queryResJSON.prevPage,
        //     },
        //   ];
        //   return currentData;
        // });
      });
    //^//[3] then, the results from the 1st then() are passed as "queryResJSON",
    //and at that point we can use this JSON object to do whatever with, such as stringify it, or
    //display it in a table on the frontend
  }
  onDestroy(() => {
    //empty pagin and table stores when navigating away from imwClicker, so pagin and tables don't linger
    // paginData.set([
    //   {
    //     totalPages: null,
    //     currentPage: null,
    //   },
    // ]);

    rbInvUpdaterAuditResTblData.set([{}]);
  });
</script>

<div style="text-align:center">
  <textarea
    class="query"
    id="initialQuery"
    name="tblQryPost"
    cols="33"
    rows="3"
    wrap="soft"
    bind:this="{initialQueryText}">
    {initialQuery}
  </textarea>
</div>

<!-- //////////////button//////////////////////////// -->
<div style="text-align:center">
  <button on:click="{rbInvUpdater}">rbInvUpdater</button>
</div>

<!-- /////////// -->

{#if $rbInvUpdaterAuditResTblData.rbInvJoinArr_ind}
  <!-- {#if Object.keys($rbInvUpdaterAuditResTblData.rbInvJoinArr_ind[0]).length > 0} -->
  <RbInvUpdaterAuditResTbl />
  <!-- {/if} -->
{/if}
