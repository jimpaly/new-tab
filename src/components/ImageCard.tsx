import * as React from "react";
import Wallpaper from "../database/wallpaper-db";
import { oneLine } from "common-tags";

interface ImageCardProps {
  wallpaper: Wallpaper;
  loaded: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onEnabledUpdate?: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  wallpaper,
  loaded,
  onClick,
  onDelete,
  onEnabledUpdate,
}) => {
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);
  const [enabled, setEnabled] = React.useState<boolean>(wallpaper.enabled);

  React.useEffect(() => {
    setEnabled(wallpaper.enabled);
  }, [wallpaper.enabled]);

  React.useEffect(() => {
    if (loaded)
      wallpaper.loadThumbnail().then((image) => {
        if (image) setThumbnail(image);
      });
    if (!loaded) setThumbnail(null);
  }, [loaded, wallpaper]);

  return (
    <div className="v-list" style={{ gap: "5px" }}>
      <button
        className="image focus"
        disabled={!enabled}
        style={{
          backgroundImage: thumbnail ? `url("${thumbnail}")` : "",
          width: "100px",
          height: "100px",
          borderRadius: "10px",
        }}
        onClick={thumbnail && enabled ? onClick : () => {}}
      >
        {thumbnail ? "" : "loading..."}
      </button>
      <button onClick={() => wallpaper.download()}>download</button>
      <button
        onClick={() => {
          wallpaper.enabled = !wallpaper.enabled;
          wallpaper.saveData();
          setEnabled(wallpaper.enabled);
          if (onEnabledUpdate) onEnabledUpdate();
        }}
      >
        {wallpaper.enabled ? "disable" : "enable"}
      </button>
      <button
        className="danger-button"
        onClick={async () => {
          const download = window.confirm(oneLine`
            Before deleting this image forever, 
            would you like to download it, just in case?`);
          if (download) await wallpaper.download();
          wallpaper.delete();
          if (onDelete) onDelete();
        }}
      >
        delete
      </button>
    </div>
  );
};

export default ImageCard;
