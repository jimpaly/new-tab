import * as React from "react";
import { oneLine, stripIndents } from "common-tags";
import Wallpaper from "../database/wallpaper-db";
import "../index.css";
import ImageCard from "./ImageCard";
// const ImageCard = React.lazy(() => import("./ImageCard"));

interface ChooserProps {
  setBackground(wallpaper: Wallpaper): void;
}

export const ImageChooser: React.FC<ChooserProps> = (props: ChooserProps) => {
  let chooserElement: React.RefObject<HTMLInputElement> = React.createRef();
  const [images, setImages] = React.useState<Wallpaper[]>([]);
  const [loadRange, setLoadRange] = React.useState<{ min: Number; max: number }>({
    min: 0,
    max: 9,
  });
  const [allEnabled, setAllEnabled] = React.useState<boolean>(false);
  React.useEffect(() => {
    Wallpaper.getAllIds().then(async (ids) => {
      let imgs = await Wallpaper.getMany(ids);
      setImages(imgs);
      setAllEnabled(imgs.find((image) => !image.enabled) === undefined);
    });
  }, []);

  function isAllEnabled() {
    return images.find((image) => !image.enabled) === undefined;
  }
  /** Add background images to Chrome's local storage */
  async function addBackgrounds(files: File[]) {
    let errors: { notImage: File[]; tooBig: File[]; read: File[] } = {
      notImage: [],
      tooBig: [],
      read: [],
    };

    let imgs = images.slice();

    let lastWallpaper: Wallpaper | null = null;
    for (const file of files) {
      const newWallpaper = await Wallpaper.add(file);
      // Error if file isn't an image
      if (newWallpaper === "notImage") errors.notImage.push(file);
      // Error if file is too large (>10MB)
      else if (newWallpaper === "tooBig") errors.tooBig.push(file);
      // Error reading file
      else if (newWallpaper === null) errors.read.push(file);
      else {
        lastWallpaper = newWallpaper;
        imgs.push(newWallpaper);
        setImages(imgs.slice());
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
          const newWallpaper = await Wallpaper.add(file);
          if (newWallpaper && newWallpaper !== "notImage" && newWallpaper !== "tooBig")
            imgs.push(newWallpaper);
          setImages(imgs.slice());
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

    setImages(imgs);
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
    <div className="v-list" style={{ gap: "10px" }}>
      <div
        className="panel h-list scroll-padding"
        style={{
          gap: "10px",
          height: "200px",
          justifyContent: images.length > 0 ? "left" : "center",
        }}
        onScroll={(element) => loadUnload(Math.floor(element.currentTarget.scrollLeft / 110))}
      >
        {images.length > 0 ? (
          images.map((image, idx) => (
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
              onEnabledUpdate={() => setAllEnabled(isAllEnabled())}
            />
            // </React.Suspense>
          ))
        ) : (
          <h3 style={{ alignSelf: "center" }}>No images here yet... Try adding some!</h3>
        )}
      </div>
      <div className="h-list">
        <label className="flex-item styled-button" htmlFor="upload">
          Add Wallpapers
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
        {/* <button className="styled-button" onClick={() => DB.downloadMany(images)}>
          Download All
        </button> */}
        <button
          className="styled-button flex-item"
          onClick={() => {
            let newImages = images.slice();
            if (!allEnabled)
              newImages.forEach((image, idx) => {
                if (!image.enabled) {
                  newImages[idx].enabled = image.enabled = true;
                  image.saveData();
                }
              });
            else
              newImages.forEach((image, idx) => {
                newImages[idx].enabled = image.enabled = false;
                image.saveData();
              });
            setImages(newImages);
            setAllEnabled(isAllEnabled());
          }}
        >
          {allEnabled ? "Disable All" : "Enable All"}
        </button>
        <button
          className="danger-button flex-item"
          onClick={async () => {
            const confirm = window.confirm(oneLine`
              Are you sure you want to delete all your saved images? 
              This can't be undone!`);
            if (!confirm) return;
            alert("Deleting images... This might take a moment.");
            await Wallpaper.deleteAll();
            setImages([]);
          }}
        >
          Delete All
        </button>
      </div>
    </div>
  );
};
