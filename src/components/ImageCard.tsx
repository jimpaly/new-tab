import * as React from "react";
import * as DB from "../wallpaper-db";

interface ImageCardProps {
  image: DB.Wallpaper;
  loaded: boolean;
  onClick?: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = (props: ImageCardProps) => {
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (props.loaded && !thumbnail)
      props.image.loadThumbnail().then((image) => {
        if (image) setThumbnail(image);
      });
    if (!props.loaded && thumbnail) setThumbnail(null);
  }, [props.loaded, props.image, thumbnail]);
  return (
    <div className="v-list">
      <button
        className="image focus-button"
        style={{
          backgroundImage: thumbnail ? `url("${thumbnail}")` : "",
          width: "100px",
          height: "100px",
          borderRadius: "10px",
        }}
        onClick={thumbnail ? props.onClick : () => {}}
      >
        {thumbnail ? "" : "loading..."}
      </button>
      <button className="stadium">click1</button>
      <button className="stadium">click2</button>
    </div>
  );
};

export default ImageCard;

// export default class ImageCard extends React.PureComponent<ImageCardProps, ImageCardState> {
//   constructor(props: ImageCardProps) {
//     super(props);
//     this.state = {
//       thumbnail: null,
//     };
//   }

//   async componentDidMount() {
//     console.log(`mounted ${this.props.image.id}`);
//     if (!this.props.loaded) return;
//     this.setState({
//       thumbnail: await this.props.image.loadImage(),
//     });
//   }

//   componentWillUnmount() {
//     console.log(`unmounted ${this.props.image.id}`);
//   }

//   async componentDidUpdate() {
//     console.log(`updated ${this.props.loaded}`);
//     if (!this.props.loaded) return;
//     this.setState({
//       thumbnail: await this.props.image.loadImage(),
//     });
//   }

//   async load() {
//     this.setState({
//       thumbnail: await this.props.image.loadImage(),
//     });
//   }

//   unload() {
//     this.setState({
//       thumbnail: null,
//     });
//   }

//   render() {
//     return (
//       <div className="v-list">
//         <button
//           className="image focus-button"
//           style={{
//             backgroundImage: `url("${this.state.thumbnail}")`,
//             width: "100px",
//             height: "100px",
//             borderRadius: "10px",
//           }}
//           onClick={this.props.onClick}
//         >
//           {this.state.thumbnail ? "" : "loading..."}
//         </button>
//         <button className="stadium">click1</button>
//         <button className="stadium">click2</button>
//       </div>
//     );
//   }
// }
