import * as React from "react";
import { oneLine, stripIndents } from "common-tags";
import * as DB from "../wallpaper-db";
import "../index.css";
import ImageCard from "./ImageCard";
// const ImageCard = React.lazy(() => import("./ImageCard"));

interface ChooserProps {
  setBackground(url: DB.Wallpaper): void;
}

export const ImageChooser: React.FC<ChooserProps> = (props: ChooserProps) => {
  let chooserElement: React.RefObject<HTMLInputElement> = React.createRef();
  const [images, setImages] = React.useState<DB.Wallpaper[]>([]);
  const [loadRange, setLoadRange] = React.useState<{ min: Number; max: number }>({
    min: 0,
    max: 9,
  });

  React.useEffect(() => {
    DB.getAllIds().then(async (ids) => {
      setImages(await DB.getMany(ids));
    });
  }, []);

  /** Add background images to Chrome's local storage */
  async function addBackgrounds(files: File[]) {
    let errors: { notImage: File[]; tooBig: File[]; read: File[] } = {
      notImage: [],
      tooBig: [],
      read: [],
    };

    let lastWallpaper: DB.Wallpaper | null = null;
    for (const file of files) {
      const newWallpaper = await DB.add(file);
      // Error if file isn't an image
      if (newWallpaper === "notImage") errors.notImage.push(file);
      // Error if file is too large (>10MB)
      else if (newWallpaper === "tooBig") errors.tooBig.push(file);
      // Error reading file
      else if (newWallpaper === null) errors.read.push(file);
      else {
        let imgs = images.slice();
        imgs.push(newWallpaper);
        setImages(imgs);
        lastWallpaper = newWallpaper;
      }
    }

    // Handle images that are too large
    if (errors.tooBig.length > 0) {
      let confirm = false;
      if (errors.tooBig.length === 1) {
        confirm = window.confirm(stripIndents`
          The following images are pretty big (>10MB). Are you sure you want to upload them?
          ${errors.tooBig.map((file) => file.name).join(", ")}`);
      } else {
        confirm = window.confirm(oneLine`
          The image ${errors.tooBig[0].name} is pretty big (>10MB). 
          Are you sure you want to upload it?`);
      }
      if (confirm) {
        for (const file of errors.tooBig) {
          let imgs = images.slice();
          const newWallpaper = await DB.add(file);
          if (newWallpaper && newWallpaper !== "notImage" && newWallpaper !== "tooBig")
            imgs.push(newWallpaper);
          setImages(imgs);
        }
      }
    }

    // Alert about files that weren't images
    if (errors.notImage.length === 1) {
      alert(`The file ${errors.notImage[0].name} isn't an image!`);
    } else if (errors.notImage.length > 1) {
      alert(stripIndents`
        The following files aren't images, so I skipped them.
        ${errors.notImage.map((file) => file.name).join(", ")}`);
    }

    // Alert about files that had an error while reading/saving
    if (errors.read.length === 1) {
      alert(`Oops! I had a problem reading the file ${errors.read[0].name}.`);
    } else if (errors.read.length > 1) {
      alert(stripIndents`
        Oops! I had a problem reading the following files.
        ${errors.read.map((file) => file.name).join(", ")}`);
    }

    return lastWallpaper;
  }

  /** Load and unload images not in view */
  function loadUnload(scrollPos: number) {
    const first = Math.floor(scrollPos / 5) * 5;
    if (first - 5 === loadRange.min && first + 9 === loadRange.max) return;
    setLoadRange({
      min: first - 5,
      max: first + 9,
    });
  }

  return (
    <div className="v-list">
      <div
        className="h-list"
        style={{ gap: "10px", paddingBottom: "3px" }}
        onScroll={(element) => loadUnload(Math.floor(element.currentTarget.scrollLeft / 110))}
      >
        {images.map((image, idx) => (
          // <React.Suspense fallback={<div>Loading...</div>} key={idx}>
          <ImageCard
            key={image.id}
            image={image}
            loaded={loadRange.min <= idx && loadRange.max >= idx}
            onClick={() => props.setBackground(image)}
            onDelete={() => {
              let imgs = images.slice();
              imgs.splice(idx, 1);
              setImages(imgs);
            }}
          />
          // </React.Suspense>
        ))}
      </div>
      <div>
        <label htmlFor="upload">
          <button className="stadium styled-button" style={{ pointerEvents: "painted" }}>
            Add Wallpapers
          </button>
        </label>
        <input
          id="upload"
          multiple
          type="file"
          ref={chooserElement}
          style={{ display: "none" }}
          onChange={async () => {
            if (!chooserElement.current?.files?.length) return;
            const bg = await addBackgrounds(Array.from(chooserElement.current.files));
            if (bg) props.setBackground(bg);
          }}
        />
      </div>
    </div>
  );
};
