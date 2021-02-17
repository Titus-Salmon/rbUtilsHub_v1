import {
  writable
} from 'svelte/store'

const paginData = writable([{
  totalPages: null,
  currentPage: 0,
  nextPage: 1,
  prevPage: -1
}])

export default {
  paginData
}