export interface WallpaperData {
  createdAt: Date; // tags?
}

export class Wallpaper {
  id: string;
  createdAt: Date | null;

  constructor(id: string, data?: Partial<WallpaperData>) {
    this.id = id;
    this.createdAt = data?.createdAt ?? null;
  }

  loadImage() {
    return new Promise<string | null>((resolve) => {
      if (process.env.NODE_ENV !== "production") return resolve(this.id);
      chrome.storage.local.get(`image-${this.id}`, (result: any) => {
        if (result && typeof result[`image-${this.id}`] === "string") {
          resolve(result[`image-${this.id}`]);
        } else {
          resolve(null);
        }
      });
    });
  }
}

export function getAllIds() {
  return new Promise<string[]>((resolve) => {
    if (process.env.NODE_ENV !== "production") {
      return resolve(
        Array.from(
          { length: 9 },
          (v, i) => `https://picsum.photos/${(8 + i) * 100}/${(16 - i) * 100}`
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

export async function getRandom() {
  if (process.env.NODE_ENV !== "production") return null;
  const ids = await getAllIds();
  if (ids.length > 0) return get(ids[Math.floor(Math.random() * ids.length)]);
  else return null;
}

export function getMany(...ids: string[]) {
  return new Promise<Wallpaper[]>((resolve) => {
    if (process.env.NODE_ENV !== "production") return resolve(ids.map((id) => new Wallpaper(id)));
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

export function get(id: string) {
  return new Promise<Wallpaper | null>((resolve) => {
    if (process.env.NODE_ENV !== "production") return resolve(null);
    chrome.storage.local.get(`data-${id}`, (result: any) => {
      if (result) {
        resolve(new Wallpaper(id, result[`data-${id}`]));
      } else {
        resolve(null);
      }
    });
  });
}

export function add(file: File) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2);

  // Read file with FileReader
  return new Promise<Wallpaper | "notImage" | "tooBig" | null>((resolve, reject) => {
    if (process.env.NODE_ENV !== "production") return resolve(null);
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
        data["images"] = [...(await getAllIds()), id];
        data[`data-${id}`] = { createdAt: new Date() } as WallpaperData;
        // data[`thumbnail-${id}`] = "stuff";
        data[`image-${id}`] = reader.result;
        // Save data
        chrome.storage.local.set(data, () => {
          console.log(chrome.runtime.lastError);
          console.log("saved:");
          console.info(data);
          resolve(new Wallpaper(id, data[`data-${id}`]));
        });
      } else resolve(null);
    };
    reader.readAsDataURL(file);
  });
}
