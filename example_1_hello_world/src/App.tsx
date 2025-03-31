import { useState, FC } from "react";
import "./App.css";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const Button: FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <div className="btn-container">
      <button className="btn" onClick={onClick}>
        {text.toUpperCase()}
      </button>
    </div>
  );
};

const App: FC = () => {
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
};

export default App;
