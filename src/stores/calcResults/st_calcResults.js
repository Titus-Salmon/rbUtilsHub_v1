import {
  writable
} from 'svelte/store'

const calcResStore = writable([{
  // defaultVal: 'defaultVal'
  calcResStoreData: null
}])

export default calcResStore