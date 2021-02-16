<script>
import paginData from "../../stores/pagination/st_pagination1.js";
// let pagin_data;
// paginData.subscribe((paginData_t0d) => (pagin_data = paginData_t0d));
</script>

<style>
</style>

<body>
  <!--v-- NOTE: you must use the $ to access the paginData store -->
  {#if typeof $paginData.totalPages === "number"}
    <p>$paginData.totalPages==> {$paginData.totalPages}</p>
    <p>typeof $paginData.totalPages==> {typeof $paginData.totalPages}</p>
  {/if}
</body>
