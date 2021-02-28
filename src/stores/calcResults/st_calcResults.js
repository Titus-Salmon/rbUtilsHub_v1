import {
  writable
} from 'svelte/store'

const calcResStore = writable([{
  // defaultVal: 'defaultVal'
  calcResStoreResponse: null
}])

export default calcResStore