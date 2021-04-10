import * as React from "react";
import { oneLine, stripIndents } from "common-tags";
import * as DB from "../wallpaper-db";
import "../index.css";

const ImageCard = React.lazy(() => import("./ImageCard"));

interface ChooserProps {
  setBackground(url: DB.Wallpaper): void;
}
interface ChooserState {
  images: DB.Wallpaper[];
}

export class ImageChooser extends React.PureComponent<ChooserProps, ChooserState> {
  chooserElement: React.RefObject<HTMLInputElement> = React.createRef();

  constructor(props: ChooserProps) {
    super(props);
    this.state = {
      images: [],
    };
  }

  async componentDidMount() {
    console.log(await DB.getAllIds());
    this.setState({
      images: await DB.getMany(...(await DB.getAllIds())),
    });
  }

  /** Add background images to Chrome's local storage */
  async addBackgrounds(files: File[]) {
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
        let images = this.state.images.slice();
        images.push(newWallpaper);
        this.setState({ images: images });
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
          let images = [...this.state.images];
          const newWallpaper = await DB.add(file);
          if (newWallpaper && newWallpaper !== "notImage" && newWallpaper !== "tooBig")
            images.push(newWallpaper);
          this.setState({ images: images });
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

  render() {
    return (
      <div className="v-list">
        <div className="h-list" style={{ gap: "10px" }}>
          {this.state.images.map((image, idx) => (
            <React.Suspense fallback={<div>Loading...</div>} key={idx}>
              <ImageCard image={image} onClick={() => this.props.setBackground(image)} />
            </React.Suspense>
          ))}
        </div>
        <input
          multiple
          type="file"
          ref={this.chooserElement}
          onChange={async () => {
            if (!this.chooserElement.current?.files?.length) return;
            const bg = await this.addBackgrounds(Array.from(this.chooserElement.current.files));
            if (bg) this.props.setBackground(bg);
          }}
        />
      </div>
    );
  }
}
