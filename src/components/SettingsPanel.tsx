import * as React from "react";
import { ImageChooser } from "./ImageChooser";
import Wallpaper from "../database/wallpaper-db";
import { gears } from "../svg.jsx";

interface SettingsProps {
  className?: string;
  setBackground?: (wallpaper: Wallpaper) => void;
}

export const SettingsPanel: React.FC<SettingsProps> = ({ className, setBackground }) => {
  const [visible, setVisible] = React.useState<boolean>(false);

  return (
    <div className={`settings bottom-left left-align ${className ?? ""}`}>
      <div className={`panel bottom-left v-list ${visible ? "animate-in" : "animate-out"}`}>
        <ImageChooser setBackground={setBackground ?? (() => {})} />
        <div style={{ height: "30px" }}></div>
      </div>
      <div className="panel bottom-left" style={{ backgroundColor: "transparent" }}>
        <button
          className="unstyled-button"
          onClick={() => {
            setVisible(!visible);
          }}
        >
          <svg
            width="30px"
            height="30px"
            viewBox="0 0 2048 2048"
            className={`${visible ? "enabled" : ""} settings-toggle`}
          >
            <path d={gears} />
          </svg>
        </button>
      </div>
    </div>
  );
};
