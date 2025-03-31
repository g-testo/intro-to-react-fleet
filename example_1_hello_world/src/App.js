import React from "react";
import "./App.css";

function Button(props) {
  return React.createElement(
    "div",
    { className: "btn-container" },
    React.createElement("button", { className: "btn", onClick: props.onClick }, props.text.toUpperCase())
  );
}

function App() {
  // Use React.useState (instead of destructuring from 'react')
  const [message, setMessage] = React.useState("");

  const handleClick = () => {
    setMessage("Button clicked!");
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Button, {
      text: "Get more info",
      onClick: handleClick,
    }),
    React.createElement("h2", null, message)
  );
}

export default App;
