import {
  writable
} from 'svelte/store'

const utilResponses = writable([{
  saveToCSV: null,
  saveToCSVcreatePop: null,
  saveToXLSX: null
}])

export default utilResponses