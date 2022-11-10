import { toast, type SvelteToastOptions } from "@zerodevx/svelte-toast";

const toastWidth = "500px";

const errorTheme = {
  '--toastColor': 'white',
  '--toastBackground': '#78052f',
  '--toastBarBackground': '#ff99be',
  '--toastWidth': toastWidth,
};

export const error = (title: string = "Error", body: string = "There was an error.", options: SvelteToastOptions = {}) => {
  options.theme = errorTheme;
  toast.push(`<strong>${title}</strong><br />${body}<br />`, options);
}

const successTheme = {
  '--toastColor': 'white',
  '--toastBackground': '#005e08',
  '--toastBarBackground': '#d8f2da',
  '--toastWidth': toastWidth,
};

export const success = (title: string = "Success", body: string = "", options: SvelteToastOptions = {}) => {
  options.theme = successTheme;
  toast.push(`<strong>${title}</strong><br />${body}<br />`, options);
}

const warningTheme = {
  '--toastColor': 'white',
  '--toastBackground': '#9c6713',
  '--toastBarBackground': '#f5d095',
  '--toastWidth': toastWidth,
};

export const warning = (title: string = "Warning", body: string = "", options: SvelteToastOptions = {}) => {
  options.theme = warningTheme;
  toast.push(`<strong>${title}</strong><br />${body}<br />`, options);
}