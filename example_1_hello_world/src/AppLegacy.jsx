import { Component } from "react";
import "./App.css";

class Button extends Component {
  render() {
    return (
      <div className="btn-container">
        <button className="btn" onClick={this.props.onClick}>
          {this.props.text.toUpperCase()}
        </button>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  handleClick = () => {
    this.setState({ message: "Button clicked!" });
  };

  render() {
    return (
      <>
        <Button text="Get more info" onClick={this.handleClick} />
        <h2>{this.state.message}</h2>
      </>
    );
  }
}

export default App;
