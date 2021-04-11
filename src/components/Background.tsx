import * as React from "react";
import Wallpaper from "../database/wallpaper-db";

interface BackgroundProps {
  wallpaper: Wallpaper | null;
}

export const Background: React.FC<BackgroundProps> = ({ wallpaper }) => {
  const [url, setURL] = React.useState<string>("/default.svg");

  React.useEffect(() => {
    console.log("bye");
    if (!wallpaper)
      Wallpaper.getRandom().then(async (newWallpaper) => {
        if (!newWallpaper) return;
        setURL((await newWallpaper.loadImage()) ?? "/default.svg");
      });
    else wallpaper.loadImage().then((wallpaperURL) => setURL(wallpaperURL ?? "/default.svg"));
  }, [wallpaper]);

  return <div className="background" style={{ backgroundImage: `url("${url}")` }}></div>;
};

// export class Background extends React.PureComponent<{}, BackgroundState> {
//   constructor(props: {}) {
//     super(props);
//     this.state = {
//       url: "/default.svg",
//     };
//   }
//   async componentDidMount() {
//     this.setImage();
//   }
//   async setImage(wallpaper?: Wallpaper) {
//     if (!wallpaper) wallpaper = (await Wallpaper.getRandom()) ?? undefined;
//     if (wallpaper) {
//       const url = await wallpaper.loadImage();
//       if (url) {
//         this.setState({ url: url });
//       }
//     }
//   }
//   render() {
//     return (
//       <div className="background" style={{ backgroundImage: `url("${this.state.url}")` }}>
//         {/* <img src={`${this.state.url}`} alt="background"/> */}
//       </div>
//     );
//   }
// }
