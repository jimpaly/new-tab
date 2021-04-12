import * as React from "react";
import Wallpaper from "../database/wallpaper-db";

interface BackgroundProps {
  wallpaper: Wallpaper | null;
}

export const Background: React.FC<BackgroundProps> = ({ wallpaper }) => {
  const [url, setURL] = React.useState<string>("/default.svg");
  const [url2, setURL2] = React.useState<string>("");

  React.useEffect(() => {
    call(wallpaper);
    async function call(wallpaper: Wallpaper | null) {
      if (!wallpaper) wallpaper = await Wallpaper.getRandom();
      if (!wallpaper) return;
      const newURL = await wallpaper.loadImage();
      if (!newURL) return;
      setURL2(newURL);
      setTimeout(() => setURL(newURL), 2100);
      setTimeout(() => setURL2(""), 2200);
    }
    // if (wallpaper) wallpaper.loadImage().then((newURL) => setURL((url) => newURL ?? url));
    // else
    //   Wallpaper.getRandom().then(async (wallpaper) => {
    //     wallpaper?.loadImage().then((newURL) => setURL((url) => newURL ?? url));
    //   });
  }, [wallpaper]);

  // return <img className="background" src={url} alt="background" />;

  return (
    <div className="background" style={{ backgroundImage: `url("${url}")` }}>
      <div
        className="background"
        style={{ backgroundImage: `url("${url2}")`, opacity: url2 !== "" ? 1 : 0 }}
      ></div>
    </div>
  );
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
