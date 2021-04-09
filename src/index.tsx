import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Background, Clock, Settings } from "./components";
import * as DB from "./wallpaper-db";

export default class App extends React.PureComponent<{}, {}> {
  backgroundElement: React.RefObject<Background> = React.createRef();
  render() {
    return (
      <div className="App">
        <Background ref={this.backgroundElement} />
        <Clock
          updateBackground={async () => {
            this.backgroundElement.current?.setImage();
          }}
        />
        <Settings
          className="bottom-left"
          setBackground={(wallpaper: DB.Wallpaper) =>
            this.backgroundElement.current?.setImage(wallpaper)
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
