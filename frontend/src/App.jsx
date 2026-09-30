import { useState } from "react";
import {
  parseExpression,
  calculateExpression
} from "./logic/calculator";

import { downloadJson } from "./utils/downloadJson";
import {
  isValidNumber,
  isValidOperator
} from "./logic/validation";

function NumberButton(props) {
  return (
    <button onClick={() => props.onNumberClick(props.number)}>
      {props.number}
    </button>
  );
}

function OperatorButton(props) {
  return (
    <button onClick={() => props.onOperatorClick(props.operator)}>
      {props.operator}
    </button>
  );
}

function App() {

  const [display, setDisplay] = useState("0");
  const [operator, setOperator] = useState(null);
  const [firstNumber, setFirstNumber] = useState(null);
  const [waitingForNumber, setWaitingForNumber] = useState(false);
  const [history, setHistory] = useState([]);
  const [expression, setExpression] = useState("");

  function handleDelete() {
    if (expression.length === 0) {
      return;
    }

    const newExpression = expression.slice(0, -1);

    setExpression(newExpression);

    if (
      newExpression.endsWith("+") ||
      newExpression.endsWith("-") ||
      newExpression.endsWith("*") ||
      newExpression.endsWith("/") ||
      newExpression.endsWith("%")
    ) {
      setDisplay("0");
      setWaitingForNumber(true);
    } else {
      const parts = parseExpression(newExpression);
      const lastPart = parts[parts.length - 1];

      setDisplay(String(lastPart));
      setWaitingForNumber(false);
    }
  }

  
  function handleClear() {
    setDisplay("0");
    setOperator(null);
    setFirstNumber(null);
    setWaitingForNumber(false);
    setExpression("");
  }

function handleParenthesis(parenthesis) {
  const openParentheses =
    (expression.match(/\(/g) || []).length;

  const closeParentheses =
    (expression.match(/\)/g) || []).length;

  if (parenthesis === ")" && openParentheses <= closeParentheses) {
    return;
  }

  setExpression(expression + parenthesis);
}



  function handleDecimal() {
    const currentNumber = display;

    if (currentNumber.includes(".")) {
      return;
    }

    setDisplay(currentNumber + ".");
    setExpression(expression + ".");
  }

 

  function handleCalculate() {
    // إذا كانت العملية محسوبة مسبقًا، لا نحسب مرة ثانية
    if (expression.includes("=")) {
      return;
    }

    // إذا انتهت العملية بـ operator، لا نحسب
    if (
      expression.endsWith("+") ||
      expression.endsWith("-") ||
      expression.endsWith("*") ||
      expression.endsWith("/") ||
      expression.endsWith("%")
    ) {
      return;
    }

    const parts = parseExpression(expression);

    const result = calculateExpression(parts);

    setDisplay(String(result));

    setHistory([
      ...history,
      {
        expression: expression,
        result: result
      }
    ]);

    setExpression(expression + "=" + result);
  }

  function handleNumber(number) {
      if (!isValidNumber(number)) {
    return;
  }
    if (waitingForNumber) {
      setDisplay(number);
      setExpression(expression + number);
      setWaitingForNumber(false);
    } else if (display === "0") {
      setDisplay(number);
      setExpression(number);
    } else {
      setDisplay(display + number);
      setExpression(expression + number);
    }
  }

  function handleOperator(newOperator) {
    if (!isValidOperator(newOperator)) {
  return;
}
    if (
      expression.endsWith("+") ||
      expression.endsWith("-") ||
      expression.endsWith("*") ||
      expression.endsWith("/") ||
      expression.endsWith("%")
    ) {
      const newExpression =
        expression.slice(0, -1) + newOperator;

      setExpression(newExpression);
    } else {
      setExpression(expression + newOperator);
    }

    setFirstNumber(display);
    setOperator(newOperator);
    setWaitingForNumber(true);
  }

  function handleClearHistory() {
    setHistory([]);
  }

  

  return (
    <div className="calculator-container">

      <h1>Calculator</h1>

      <h2 className="display">
        {expression || "0"}
      </h2>

      <div className="buttons">

        <NumberButton
          number="0"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="1"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="2"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="3"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="4"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="5"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="6"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="7"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="8"
          onNumberClick={handleNumber}
        />

        <NumberButton
          number="9"
          onNumberClick={handleNumber}
        />

        <OperatorButton
          operator="+"
          onOperatorClick={handleOperator}
        />

        <OperatorButton
          operator="-"
          onOperatorClick={handleOperator}
        />

        <OperatorButton
          operator="*"
          onOperatorClick={handleOperator}
        />

        <OperatorButton
          operator="/"
          onOperatorClick={handleOperator}
        />

        <OperatorButton
          operator="%"
          onOperatorClick={handleOperator}
        />

        <button onClick={handleCalculate}>
          =
        </button>

        <button onClick={handleClear}>
          C
        </button>

        <button onClick={handleDecimal}>
          .
        </button>

        <button onClick={handleDelete}>
          ⌫
        </button>

      </div>

      <div className="buttons">

        <button onClick={() => handleParenthesis("(")}>
          (
        </button>

        <button onClick={() => handleParenthesis(")")}>
          )
        </button>

      </div>

      <div className="history-buttons">

        <button onClick={handleClearHistory}>
          Clear History
        </button>

<button onClick={() => downloadJson(history)}>
  Download JSON
</button>

      </div>

      <div className="history">

        <h2>History</h2>

        {history.map((item, index) => (
          <p className="history-item" key={index}>
            {item.expression} = {item.result}
          </p>
        ))}

      </div>

    </div>
  );
}

export default App;