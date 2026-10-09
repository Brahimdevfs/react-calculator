
import { useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waiting, setWaiting] = useState(false);

  function inputNumber(number) {
    if (waiting) {
      setDisplay(number);
      setWaiting(false);
    } else {
      setDisplay(display === "0" ? number : display + number);
    }
  }

  function inputDecimal() {
    if (waiting) {
      setDisplay("0.");
      setWaiting(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  }

  function clear() {
    setDisplay("0");
    setPrevious(null);
    setOperator(null);
    setWaiting(false);
  }

  function chooseOperator(nextOperator) {
    const current = Number(display);

    if (operator && !waiting) {
      const result = calculate(previous, current, operator);

      if (!Number.isFinite(result)) {
        setDisplay("Error");
        setPrevious(null);
        setOperator(null);
        setWaiting(true);
        return;
      }

      setDisplay(String(Number(result.toFixed(10))));
      setPrevious(result);
    } else {
      setPrevious(current);
    }

    setOperator(nextOperator);
    setWaiting(true);
  }

  function calculate(a, b, op) {
    if (op === "+") return a + b;
    if (op === "−") return a - b;
    if (op === "×") return a * b;
    if (op === "÷") return b === 0 ? NaN : a / b;
    return b;
  }

  function equals() {
    if (operator === null || previous === null) return;

    const result = calculate(previous, Number(display), operator);

    setDisplay(
      Number.isFinite(result)
        ? String(Number(result.toFixed(10)))
        : "Error"
    );

    setPrevious(null);
    setOperator(null);
    setWaiting(true);
  }

  function toggleSign() {
    if (display === "0" || display === "Error") return;
    setDisplay(String(Number(display) * -1));
  }

  function percentage() {
    if (display !== "Error") {
      setDisplay(String(Number(display) / 100));
    }
  }

  function deleteLast() {
    if (waiting || display === "Error") return;

    setDisplay(
      display.length > 1 ? display.slice(0, -1) : "0"
    );
  }

  function handleButton(value) {
    if (value === "AC") clear();
    else if (value === "DEL") deleteLast();
    else if (value === "±") toggleSign();
    else if (value === "%") percentage();
    else if (value === ".") inputDecimal();
    else if (value === "=") equals();
    else if (["+", "−", "×", "÷"].includes(value)) {
      chooseOperator(value);
    } else {
      inputNumber(value);
    }
  }

  const buttons = [
    ["AC", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["DEL", "0", ".", "="],
  ];

  return (
    <main className="page">
      <section className="calculator">
        <div className="top">
          <div className="brand">CALCULATOR</div>
          <div className="status">React Edition</div>
        </div>

        <div className="screen">
          <div className="expression">
            {previous !== null
              ? `${previous} ${operator || ""}`
              : "Ready"}
          </div>
          <div className="display" aria-live="polite">
            {display}
          </div>
        </div>

        <div className="buttons">
          {buttons.flat().map((value) => (
            <button
              key={value}
              className={[
                "btn",
                ["÷", "×", "−", "+"].includes(value)
                  ? "operator"
                  : "",
                value === "=" ? "equals" : "",
                ["AC", "±", "%", "DEL"].includes(value)
                  ? "utility"
                  : "",
              ].join(" ")}
              onClick={() => handleButton(value)}
              aria-label={value === "DEL" ? "Delete last digit" : value}
            >
              {value === "DEL" ? "⌫" : value}
            </button>
          ))}
        </div>

        <div className="footer">Made with React ♥</div>
      </section>
    </main>
  );
}

export default App;
