import { writable } from "svelte/store";

export const flowStore = writable({
  flow: [],
  current: {
    projectId: 0,
    projectName: "",
    moduleId: 0,
    moduleName: "",
    blockId: 0,
    blockName: "",
  }
});