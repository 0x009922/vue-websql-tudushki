/**
 * Декоратор, возвращающий функцию, которая будет всегда запускаться только отложенно на delay
 * @param {Function} func 
 * @param {number} delay 
 */
export function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Рега для экранирования специальных Regex-символов
const regEscapeRegex = /[-/\\^$*+?.()|[\]{}]/g.compile();

/**
 * Помощник для формирования RegExp из пользовательского вода через `new RegExp`.
 * Экранирует специальные символы.
 * 
 * @param {string} str
 * @returns {string}
 */
export function regEscape(str) {
  return str.replace(regEscapeRegex, '\\$&');
}
