import * as React from "react";

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
  setImage(url?: string) {
    if (url) {
      this.setState({
        url: url,
      });
    } else {
      //TODO: randomize image
      if (process.env.NODE_ENV === "production") {
        const url = chrome.storage.local.get("img0", (result: any) => {
          this.setState({
            url: result.img0,
          });
        });
      }
    }
  }
  render() {
    return (
      <div
        className="Background"
        style={{ backgroundImage: `url("${this.state.url}")` }}
      >
        {/* <img src={`${this.state.url}`} alt="background"/> */}
      </div>
    );
  }
}
