import {
  writable
} from 'svelte/store'

const tableData = writable([{
  defaultVal: 'defaultVal'
}])

export default tableData