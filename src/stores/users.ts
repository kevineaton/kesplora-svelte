import { writable } from "svelte/store";

export const userStore = writable(
  localStorage.user ? JSON.parse(localStorage.getItem("user")) : null
);