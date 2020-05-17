export function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const regEscapeRegex = /[-/\\^$*+?.()|[\]{}]/g.compile();

/**
 * 
 * @param {string} str
 * @returns {string}
 */
export function regEscape(str) {
  return str.replace(regEscapeRegex, '\\$&');
}
