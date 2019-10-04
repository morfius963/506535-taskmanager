const DEBOUNCE_INTERVAL = 300;
let lastTimeout = null;

export const debounce = (fn) => {
  if (lastTimeout) {
    window.clearTimeout(lastTimeout);
  }
  lastTimeout = window.setTimeout(fn, DEBOUNCE_INTERVAL);
};
