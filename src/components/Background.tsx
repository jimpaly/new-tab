import * as React from "react";
import * as DB from "../wallpaper-db";

interface BackgroundState {
  url: string;
}

export class Background extends React.PureComponent<{}, BackgroundState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      url: "/default.png",
    };
  }
  async componentDidMount() {
    this.setImage();
  }
  async setImage(wallpaper?: DB.Wallpaper) {
    if (!wallpaper) wallpaper = (await DB.getRandom()) ?? undefined;
    if (wallpaper) {
      const url = await wallpaper.loadImage();
      if (url) {
        this.setState({ url: url });
      }
    }
  }
  render() {
    return (
      <div className="Background" style={{ backgroundImage: `url("${this.state.url}")` }}>
        {/* <img src={`${this.state.url}`} alt="background"/> */}
      </div>
    );
  }
}
