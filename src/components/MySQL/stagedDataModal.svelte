<script>
import stagingData from "../../stores/stagingData/st_stagingData.js";
// import defaultMargArr from '../../../libT0d/defaultMargs/defaultMargs';
// console.log(`JSON.stringify(defaultMargArr[0])==> ${JSON.stringify(defaultMargArr[0])}`)
// console.log(`defaultMargArr[0]['dptName']==> ${defaultMargArr[0]['dptName']}`)
// console.log(`defaultMargArr[0]['dptNumb']==> ${defaultMargArr[0]['dptNumb']}`)
// console.log(`defaultMargArr[0]['dfltMrg']==> ${defaultMargArr[0]['dfltMrg']}`)
let tableName;
let calcResultsResponse;
// let beerAlcMarg,
//   bodyCareMarg,
//   booksMarg,
//   bulkMarg,
//   bulkHrbPrpkMarg,
//   cbdGrocMarg,
//   cbdSuppMarg,
//   cbdTopMarg,
//   consignMarg,
//   frozenMarg,
//   genMerchMarg,
//   grabGoMarg,
//   giftMarg,
//   grocMarg,
//   grocLocMarg,
//   grocLcMtMarg,
//   hbaMarg,
//   herbsHomeoMarg,
//   lfBrMarg,
//   otherMarg,
//   refrigMarg,
//   vitSuppMarg;

function calcResults() {
  fetch("server_routes/rt_MySQL/calcResults", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tableName: tableName.value,
    }),
  })
    .then((calcResultsResult) => calcResultsResult.json())
    .then((calcResultsResultJSON) => {
      console.log(
        `JSON.stringify(calcResultsResultJSON)==> ${JSON.stringify(
          calcResultsResultJSON
        )}`
      );
      calcResultsResponse = calcResultsResultJSON;

      stagingData.set([{ stagingDataResponse: calcResultsResponse }]);

      // stagingData.update((currentData) => {
      //   currentData = [
      //     {
      //       stagingDataResponse: Object.values(calcResultsResponse),
      //     },
      //   ];
      //   return currentData;
      // });
    });
}
</script>

{#if $stagingData[0].stagingDataResponse !== null}
  {#each Object.values($stagingData[0].stagingDataResponse.stagedMargins.dfltMrg) as stagedMargin}
    <div style="text-align:center;">
      <label for="{stagedMargin}">{stagedMargin}</label>
    </div>
    <div style="text-align:center">
      <input
        type="text"
        id="{stagedMargin}"
        name="{stagedMargin}"
        bind:this="{stagedMargin}" />
    </div>
  {/each}
  <div style="text-align:center">
    <button on:click="{calcResults}">calcResults</button>
  </div>
{/if}

<!-- <div style="padding: 0 1rem">
  <div style="text-align:center;">
    <label for="beerAlcMarg">Table Name</label>
  </div>
  <div style="text-align:center">
    <input
      type="text"
      id="beerAlcMarg"
      name="beerAlcMarg"
      bind:this="{beerAlcMarg}" />
  </div>
  <div style="text-align:center">
    <button on:click="{calcResults}">calcResults</button>
  </div>
</div> -->
