import { writable } from "svelte/store";

export const siteStore = writable(
  localStorage.site ? JSON.parse(localStorage.getItem("site")) : null
);