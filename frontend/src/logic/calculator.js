import { isDivisionByZero } from "./validation";

export function calculate(number1, number2, operator) {
  if (operator === "+") {
    return number1 + number2;
  }

  if (operator === "-") {
    return number1 - number2;
  }

  if (operator === "*") {
    return number1 * number2;
  }

if (operator === "/") {
  if (isDivisionByZero(number1, number2, operator)) {
    return "Error";
  }

  return number1 / number2;
}

  if (operator === "%") {
    return number1 % number2;
  }
}

export function parseExpression(expression) {
  const parts = [];
  let currentNumber = "";

  for (let i = 0; i < expression.length; i++) {
    const character = expression[i];

    // إذا كان - إشارة لرقم سالب
    if (
      character === "-" &&
      (
        i === 0 ||
        expression[i - 1] === "(" ||
        expression[i - 1] === "+" ||
        expression[i - 1] === "-" ||
        expression[i - 1] === "*" ||
        expression[i - 1] === "/" ||
        expression[i - 1] === "%"
      )
    ) {
      currentNumber = currentNumber + character;
      continue;
    }

    if (
      character === "+" ||
      character === "-" ||
      character === "*" ||
      character === "/" ||
      character === "%" ||
      character === "(" ||
      character === ")"
    ) {
      if (currentNumber !== "") {
        parts.push(Number(currentNumber));
        currentNumber = "";
      }

      parts.push(character);
    } else {
      currentNumber = currentNumber + character;
    }
  }

  if (currentNumber !== "") {
    parts.push(Number(currentNumber));
  }

  return parts;
}
export function calculateExpression(parts) {

  // أولًا نحسب ما داخل الأقواس
  while (parts.includes("(")) {
    const openIndex = parts.lastIndexOf("(");
    const closeIndex = parts.indexOf(")", openIndex);

    const inside = parts.slice(
      openIndex + 1,
      closeIndex
    );

    const result = calculateExpression(inside);

    parts.splice(
      openIndex,
      closeIndex - openIndex + 1,
      result
    );
  }

  // ثانيًا نحسب *, /, %
  for (let i = 1; i < parts.length; i += 2) {
    const operator = parts[i];

    if (
      operator === "*" ||
      operator === "/" ||
      operator === "%"
    ) {
      const number1 = parts[i - 1];
      const number2 = parts[i + 1];

      const result = calculate(
        number1,
        number2,
        operator
      );

      parts.splice(i - 1, 3, result);

      i -= 2;
    }
  }

  // ثالثًا نحسب +, -
  let result = parts[0];

  for (let i = 1; i < parts.length; i += 2) {
    const operator = parts[i];
    const number = parts[i + 1];

    result = calculate(
      result,
      number,
      operator
    );
  }

  return result;
}