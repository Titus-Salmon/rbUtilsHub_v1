<script>
import { onMount } from "svelte";
import paginData from "../../stores/pagination/st_pagination1.js";
import tableData from "../../stores/dynamicTables/tableData1.js";
</script>

<style>
</style>

<div class="flexbox">
  <!--v-- ***prevButton*********************************************************** -->
  <div>
    <div style="text-align:center">
      <button on:click="{goBack}">prev</button>
    </div>
  </div>
  <!--v-- ***currPageDispl*********************************************************** -->
  <div>
    <div style="text-align:center">
      <label for="currPage">Current Page</label>
    </div>
    <div style="text-align:center">
      <input type="text" id="currPage" name="currPage" bind:this="{currPage}" />
    </div>
  </div>
  <!--v-- ***nextButton*********************************************************** -->
  <div>
    <div style="text-align:center">
      <button on:click="{goForward}">next</button>
    </div>
  </div>
</div>
