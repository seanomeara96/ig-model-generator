import { base } from "../components/base";
import { gallery } from "../components/gallery";

import { getRandomImages } from "../utils/image-queries/get-random-images";

export function randomGallery(limit: number): Promise<string> {
  return new Promise(async function (resolve, reject) {
    try {
      const options = {
        pageTitle: `Random Model Images`,
        metaDescription: `Here you'll find ramdom model images`,
        content: gallery(await getRandomImages(limit)),
      };

      resolve(base(options));
    } catch (err) {
      reject(err);
    }
  });
}
