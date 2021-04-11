import * as React from "react";
import * as DB from "../wallpaper-db";
import { oneLine } from "common-tags";

interface ImageCardProps {
  image: DB.Wallpaper;
  loaded: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onEnabledUpdate?: () => void;
}

export const ImageCard: React.FC<ImageCardProps> = (props: ImageCardProps) => {
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);
  const [enabled, setEnabled] = React.useState<boolean>(props.image.enabled);

  React.useEffect(() => {
    setEnabled(props.image.enabled);
  }, [props.image.enabled]);

  React.useEffect(() => {
    if (props.loaded)
      props.image.loadThumbnail().then((image) => {
        if (image) setThumbnail(image);
      });
    if (!props.loaded) setThumbnail(null);
  }, [props.loaded, props.image]);

  return (
    <div className="v-list">
      <button
        className={"image focus styled-button"}
        disabled={!enabled}
        style={{
          backgroundImage: thumbnail ? `url("${thumbnail}")` : "",
          width: "100px",
          height: "100px",
          borderRadius: "10px",
        }}
        onClick={thumbnail && enabled ? props.onClick : () => {}}
      >
        {thumbnail ? "" : "loading..."}
      </button>
      <button className="stadium styled-button" onClick={() => props.image.download()}>
        download
      </button>
      <button
        className="stadium styled-button"
        onClick={() => {
          props.image.enabled = !props.image.enabled;
          props.image.saveData();
          setEnabled(props.image.enabled);
          if (props.onEnabledUpdate) props.onEnabledUpdate();
        }}
      >
        {props.image.enabled ? "disable" : "enable"}
      </button>
      <button
        className="stadium danger-button"
        onClick={async () => {
          const download = window.confirm(oneLine`
            Before deleting this image forever, 
            would you like to download it, just in case?`);
          if (download) await props.image.download();
          props.image.delete();
          if (props.onDelete) props.onDelete();
        }}
      >
        delete
      </button>
    </div>
  );
};

export default ImageCard;
