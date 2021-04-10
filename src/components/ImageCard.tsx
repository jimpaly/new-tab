import * as React from "react";
import * as DB from "../wallpaper-db";
import { oneLine } from "common-tags";

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
      <button className="stadium" onClick={() => props.image.download()}>
        download
      </button>
      <button
        className="stadium danger"
        onClick={() => {
          const download = window.confirm(oneLine`
            Before deleting this image forever, 
            would you like to download it, just in case?`);
          if (download) props.image.download();
        }}
      >
        delete
      </button>
    </div>
  );
};

export default ImageCard;
