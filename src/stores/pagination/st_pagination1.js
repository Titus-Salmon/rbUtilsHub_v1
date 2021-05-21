import {
  writable
} from "svelte/store";

const paginData = writable([{
  totalPages: null,
  currentPage: null,
}, ]);

export default paginData;