import * as React from "react";
import { oneLine } from 'common-tags'
// import * as Canvas from "canvas";

interface ChooserProps {
  setImage(url: string): void;
}

export class ImageChooser extends React.PureComponent<ChooserProps, {}> {
  chooserElement: React.RefObject<HTMLInputElement> = React.createRef();
  render() {
    return (
      <div className="ImageChooser">
        <input
          /*multiple*/ type="file"
          ref={this.chooserElement}
          onChange={() => {
            const files = this.chooserElement.current?.files
            if (!files?.length) return
            if(!files[0].type.startsWith('image/')) 
              return alert("That isn't an image!")
            if(files[0].size > 10485760 && !window.confirm(oneLine`
              This file is pretty big (>10MB). Are you sure you want to use it?
            `)) return
            var reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result !== "string") return
              this.props.setImage(reader.result);
              chrome.storage.local.set({ img0: reader.result }, () => {});
            };
            reader.readAsDataURL(files[0]);
          }}
        />
      </div>
    );
  }
}

// Don't really need this for now b/c apparently FileReader gets the url for you
// async function getImageData(url: string) {
//   const image = await Canvas.loadImage(url);
//   const canvas = Canvas.createCanvas(image.width, image.height);
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(image, 0, 0, image.width, image.height);
//   console.log(canvas.toDataURL());
//   return canvas.toDataURL();
// }
