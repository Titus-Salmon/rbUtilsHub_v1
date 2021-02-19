import {
  writable
} from 'svelte/store'

const paginData = writable([{
  totalPages: null,
  currentPage: null,
  // nextPage: 1,
  // prevPage: -1
}])

export default paginData