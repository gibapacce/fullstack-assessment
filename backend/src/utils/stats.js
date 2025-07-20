// CHANGE: mean now validates input is a non-empty array of valid numbers, throws error otherwise.
// This ensures robustness and prevents silent bugs or invalid averages.
function mean(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new Error('Input must be a non-empty array');
  }
  if (!arr.every(num => typeof num === 'number' && !isNaN(num))) {
    throw new Error('Array must contain only valid numbers');
  }
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

module.exports = { mean };