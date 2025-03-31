import { useState } from "react";
import "./App.css";

const Button = ({ text, onClick }) => {
  return (
    <div className="btn-container">
      <button className="btn" onClick={onClick}>
        {text.toUpperCase()}
      </button>
    </div>
  );
};

function App() {
  const [message, setMessage] = useState("");

  const handleClick = () => {
    setMessage("Button clicked!");
  };

  return (
    <>
      <Button text="Get more info" onClick={handleClick} />
      <h2>{message}</h2>
    </>
  );
}

export default App;
