<script>
import paginData from "../../stores/pagination/pagination1.js";
// let pagin_data;
// paginData.subscribe((paginData_t0d) => (pagin_data = paginData_t0d));
</script>

<style>
</style>

<body>
  {#if typeof $paginData === "number"}
    <p>$paginData==> {$paginData}</p>
    <p>typeof $paginData==> {typeof $paginData}</p>
  {/if}
</body>
