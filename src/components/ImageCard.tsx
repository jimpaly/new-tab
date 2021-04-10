import * as React from "react";
import * as DB from "../wallpaper-db";

interface ImageCardProps {
  image: DB.Wallpaper;
  onClick?: () => void;
}
interface ImageCardState {
  thumbnail: string | null;
}

export default class ImageCard extends React.PureComponent<ImageCardProps, ImageCardState> {
  constructor(props: ImageCardProps) {
    super(props);
    this.state = {
      thumbnail: null,
    };
  }
  async componentDidMount() {
    this.setState({
      thumbnail: await this.props.image.loadImage(),
    });
  }
  render() {
    if (this.state.thumbnail) {
      return (
        <div className="focus-button v-list">
          <button
            className="image focus-button"
            style={{
              backgroundImage: `url("${this.state.thumbnail}")`,
              width: "100px",
              height: "100px",
              borderRadius: "10px",
            }}
            onClick={this.props.onClick}
          ></button>
          <button className="stadium">click1</button>
          <button className="stadium">click2</button>
        </div>
      );
    } else {
      return (
        <div>
          <p>loading...</p>
        </div>
      );
    }
  }
}
