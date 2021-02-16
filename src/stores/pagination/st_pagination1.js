import {
  writable
} from 'svelte/store'

const paginData = writable([{
  totalPages: null,
  currentPage: null,
  nextPage: null,
  prevPage: null
}])

export default paginData