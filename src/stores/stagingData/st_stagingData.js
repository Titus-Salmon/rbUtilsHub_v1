import {
  writable
} from 'svelte/store'

const stagingData = writable([{
  // defaultVal: 'defaultVal'
  stagingDataResponse: null
}])

export default stagingData