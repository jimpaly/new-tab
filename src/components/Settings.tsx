import * as React from "react";
import { ImageChooser } from "./ImageChooser";
import * as DB from "../wallpaper-db";

interface SettingsProps {
  className?: string;
  setBackground?: (url: DB.Wallpaper) => void;
}
interface SettingsState {
  isShowing: boolean;
}

export class Settings extends React.PureComponent<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = {
      isShowing: false,
    };
  }
  render() {
    return (
      <div className={`settings left-align ${this.props.className ?? ""}`}>
        <div className={`panel ${this.state.isShowing ? "fade-in" : "fade-out"}`}>
          <ImageChooser setBackground={this.props.setBackground ?? (() => {})} />
        </div>
        <button
          className="stadium"
          onClick={() => {
            this.setState({
              isShowing: !this.state.isShowing,
            });
          }}
        >
          settings
        </button>
      </div>
    );
  }
}
