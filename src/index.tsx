import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Background, Clock, SettingsPanel } from "./components";
import Wallpaper from "./database/wallpaper-db";

export const App: React.FC<{}> = () => {
  const [wallpaper, setWallpaper] = React.useState<Wallpaper | null>(null);
  return (
    <div>
      <Background wallpaper={wallpaper} />
      <Clock
        updateBackground={async () => {
          setWallpaper(await Wallpaper.getRandom());
        }}
      />
      <SettingsPanel setBackground={(wallpaper: Wallpaper) => setWallpaper(wallpaper)} />
    </div>
  );
};

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
