import * as React from "react";
import * as DB from "../wallpaper-db";

interface ImageCardProps {
  id: string;
}
interface ImageCardState {
  data: DB.WallPaperData | null;
  thumbnail: string | null;
}

export default class ImageCard extends React.PureComponent<ImageCardProps, ImageCardState> {
  constructor(props: ImageCardProps) {
    super(props);
    this.state = {
      data: null,
      thumbnail: null,
    };
  }
  async componentDidMount() {}
  render() {
    if (this.state.data && this.state.thumbnail) {
      return (
        <div>
          <img src={this.state.thumbnail} alt="thumbnail" />
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
