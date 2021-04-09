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
      <div className={`left-align ${this.props.className ?? ""}`}>
        <div className={`panel ${this.state.isShowing ? "show-fade" : "hide-fade"}`}>
          <ImageChooser setBackground={this.props.setBackground ?? (() => {})} />
        </div>
        <button
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
