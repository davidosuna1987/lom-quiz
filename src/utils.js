export const ucf = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const zeroPad = (num, places) => String(num).padStart(places, '0');