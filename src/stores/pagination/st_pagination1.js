import {
  writable
} from 'svelte/store'

const paginData = writable([{
  totalPages: null,
  currentPage: 0,
  nextPage: 1,
  prevPage: null
}])

export default paginData