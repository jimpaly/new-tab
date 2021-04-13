import * as React from "react";
import Wallpaper from "../database/wallpaper-db";

interface BackgroundProps {
  wallpaper: Wallpaper | null;
}

export const Background: React.FC<BackgroundProps> = ({ wallpaper }) => {
  const [wallpapers, setWallpapers] = React.useState<{ id: string; url: string }[]>([
    { id: "", url: "" },
  ]);

  React.useEffect(() => {
    call(wallpaper);
    async function call(wallpaper: Wallpaper | null) {
      if (!wallpaper) wallpaper = await Wallpaper.getRandom();
      const newURL = wallpaper ? await wallpaper.loadImage() : "/default.svg";
      if (!newURL) return;
      setWallpapers((wallpapers) => [{ id: "" + Date.now(), url: newURL }].concat(wallpapers));
      setTimeout(() => setWallpapers((wallpapers) => wallpapers.slice(0, -1)), 3000);
    }
  }, [wallpaper]);

  // return <img className="background" src={url} alt="background" />;

  return (
    <div>
      {wallpapers.map((wallpaper, idx) => (
        <div
          key={wallpaper.id}
          className="background"
          style={{
            backgroundImage: `url("${wallpaper.url}")`,
            opacity: idx === 0 ? 1 : 0,
            transitionDuration: wallpaper.id ? "2s" : "300ms",
          }}
        ></div>
      ))}
    </div>
  );
};
