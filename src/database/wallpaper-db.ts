import * as Canvas from "canvas";
import { oneLine } from "common-tags";

const isTest = process.env.NODE_ENV !== "production";

export interface WallpaperData {
  createdAt?: Date; // tags?
  enabled: boolean;
}

export default class Wallpaper {
  id: string;
  createdAt: Date | null;
  enabled: boolean;

  constructor(id: string, data: Partial<WallpaperData>) {
    this.id = id;
    this.createdAt = data.createdAt ?? null;
    this.enabled = data.enabled ?? true;
  }

  loadImage() {
    return new Promise<string | null>((resolve) => {
      if (isTest) return resolve(this.id);
      chrome.storage.local.get(`image-${this.id}`, (result: any) => {
        if (result && typeof result[`image-${this.id}`] === "string") {
          resolve(result[`image-${this.id}`]);
        } else {
          resolve(null);
        }
      });
    });
  }

  loadThumbnail() {
    return new Promise<string | null>((resolve) => {
      if (isTest) return resolve(this.id);
      chrome.storage.local.get(`thumb-${this.id}`, (result: any) => {
        if (result && typeof result[`thumb-${this.id}`] === "string") {
          resolve(result[`thumb-${this.id}`]);
        } else {
          resolve(null);
        }
      });
    });
  }

  async saveData() {
    if (isTest) return;
    let data: any = {};
    const meta: WallpaperData = {
      createdAt: this.createdAt ?? undefined,
      enabled: this.enabled,
    };
    data[`data-${this.id}`] = meta;
    return new Promise<void>((resolve) => {
      chrome.storage.local.set(data, () => resolve());
    });
  }

  async download(location = "", saveAs = true) {
    let image = await this.loadImage();
    if (!image) return alert("Oops! Something went wrong while trying to load the image!");
    const extension = image.slice(image.indexOf("image/") + 6, image.indexOf(";"));
    if (isTest)
      return alert(oneLine`
        Can't actually download in development version, 
        but it should download wallpaper.${extension} with ${image}`);
    return new Promise<void>((resolve) => {
      chrome.downloads.download(
        {
          filename: `${location}wallpaper.${extension}`,
          url: image ?? "",
          saveAs: saveAs,
        },
        () => resolve()
      );
    });
  }

  delete() {
    return new Promise<void>((resolve, reject) => {
      if (isTest) reject("Not in production mode");
      chrome.storage.local.remove(
        [`image-${this.id}`, `data-${this.id}`, `thumb-${this.id}`],
        async () => {
          let ids = await Wallpaper.getAllIds();
          const idx = ids.indexOf(this.id);
          ids.splice(idx, 1);
          chrome.storage.local.set({ images: ids }, () => {
            resolve();
          });
        }
      );
    });
  }

  static getAllIds() {
    return new Promise<string[]>((resolve) => {
      if (isTest) {
        return resolve(
          Array.from(
            { length: 100 },
            (v, i) => `https://picsum.photos/${1600 + i}/${900 + i}` //${(8 + i) * 100}/${(16 - i) * 100}`
          )
        );
      }
      chrome.storage.local.get("images", (result: any) => {
        if (result && Array.isArray(result.images)) {
          resolve(result.images);
        } else {
          resolve([]);
        }
      });
    });
  }

  static async getRandom() {
    const images = await (await Wallpaper.getMany(await Wallpaper.getAllIds())).filter(
      (image) => image.enabled
    );
    if (images.length > 0) return images[Math.floor(Math.random() * images.length)];
    else return null;
  }

  static getMany(ids: string[]) {
    return new Promise<Wallpaper[]>((resolve) => {
      if (isTest) return resolve(ids.map((id) => new Wallpaper(id, {})));
      chrome.storage.local.get(
        ids.map((id) => `data-${id}`),
        (result: any) => {
          if (result) {
            resolve(
              ids
                .filter((id) => result[`data-${id}`] !== undefined)
                .map((id) => new Wallpaper(id, result[`data-${id}`]))
            );
          } else {
            resolve([]);
          }
        }
      );
    });
  }

  static get(id: string) {
    return new Promise<Wallpaper | null>((resolve) => {
      if (isTest) return resolve(null);
      chrome.storage.local.get(`data-${id}`, (result: any) => {
        if (result) {
          resolve(new Wallpaper(id, result[`data-${id}`]));
        } else {
          resolve(null);
        }
      });
    });
  }

  static add(file: File) {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);

    // Read file with FileReader
    return new Promise<Wallpaper | "notImage" | "tooBig" | null>((resolve) => {
      if (isTest) return resolve(null);
      // Error if file isn't an image
      if (!file.type.startsWith("image/")) return resolve("notImage");
      // Error if file is too large (>10MB)
      if (file.size > 10485760) return resolve("tooBig");
      // Load image with FileReader
      let reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === "string") {
          // Set data to be saved
          let data: any = {};
          data["images"] = [...(await Wallpaper.getAllIds()), id];
          const meta: WallpaperData = { createdAt: new Date(), enabled: true };
          data[`data-${id}`] = meta;
          data[`image-${id}`] = reader.result;
          // Compress for thumbnails
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = reader.result;
          img.onload = () => {
            const size = Math.min(img.width, img.height);
            const canvas = Canvas.createCanvas((img.width * 128) / size, (img.height * 128) / size);
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, (img.width * 128) / size, (img.height * 128) / size);
            data[`thumb-${id}`] = canvas.toDataURL("image/jpeg", 0.5);
            // Save data
            chrome.storage.local.set(data, () => {
              if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
              resolve(new Wallpaper(id, data[`data-${id}`]));
            });
          };
        } else resolve(null);
      };
      reader.readAsDataURL(file);
    });
  }
  //Excluding this for now because it causes a lot of lag and memory issues
  //TODO: use zip, or maybe chrome api to download more slowly
  // export async function downloadMany(images: Wallpaper[]) {
  //   for (const image of images) {
  //     await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
  //     await image.download("wallpapers/", false);
  //   }
  //   alert("Done downloading everything!");
  // }

  static deleteAll() {
    return new Promise<void>((resolve) => {
      if (isTest) resolve();
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
        resolve();
      });
    });
  }
}
