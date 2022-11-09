import { writable } from "svelte/store";

export const isSetupStore = writable(
  localStorage.isSetup ? localStorage.getItem("isSetup") === "true" : false,
);