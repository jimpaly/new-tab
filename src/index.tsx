import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Background, Clock, ImageChooser } from "./components";

export default class App extends React.PureComponent<{}, {}> {
  backgroundElement: React.RefObject<Background>;
  constructor(props: {}) {
    super(props);
    this.backgroundElement = React.createRef();
    this.state = {
      background: "logo192.png",
    };
  }
  render() {
    return (
      <div className="App">
        <Background ref={this.backgroundElement} />
        <Clock
          updateBackground={async () => {
            this.backgroundElement.current?.setImage();
          }}
        />
        <ImageChooser
          setImage={(url: string) =>
            this.backgroundElement.current?.setImage(url)
          }
        />
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
