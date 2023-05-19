import { base } from "../components/base";
import { gallery } from "../components/gallery";

import { getAllModelImages } from "../utils/image-queries/get-all-model-images";

export function modelGallery(name: string): Promise<string> {
  return new Promise(async function (resolve, reject) {
    try {
      const images: any[] = await getAllModelImages(name);
      const content = gallery(images);

      const options = {
        pageTitle: `Gallery for model: ${name}`,
        metaDescription: `Here you'll find images of ${name}`,
        content: content,
      };
      resolve(base(options));
    } catch (err) {
      reject(err);
    }
  });
}
