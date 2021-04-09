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
        <button className="focus-button image-card" onClick={this.props.onClick}>
          <img src={this.state.thumbnail} alt="thumbnail" />
        </button>
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
