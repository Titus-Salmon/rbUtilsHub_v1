import { writable } from "svelte/store";

const auditResObjStore = writable([
  {
    auditResObjData: null,
  },
]);

export default auditResObjStore;
