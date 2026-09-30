export function isValidNumber(value) {
  return !isNaN(value);
}

export function isValidOperator(operator) {
  return ["+", "-", "*", "/", "%"].includes(operator);
}

export function isDivisionByZero(number1, number2, operator) {
  return operator === "/" && number2 === 0;
}