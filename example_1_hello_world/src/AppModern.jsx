import { useState, useTransition } from "react";
import "./App.css";

function Button({ text, onClick, disabled }) {
  return (
    <div className="btn-container">
      <button className="btn" onClick={onClick} disabled={disabled}>
        {text.toUpperCase()}
      </button>
    </div>
  );
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function App() {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleClick = async () => {
    startTransition(async () => {
      await delay(2000);
      setMessage("Delayed button click with concurrency in React 19!");
    });
  };

  return (
    <>
      <Button text={isPending ? "Processing..." : "Get more info"} onClick={handleClick} disabled={isPending} />
      <h2>{message}</h2>
    </>
  );
}

export default App;
