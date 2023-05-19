import { base } from "../components/base";
import { gallery } from "../components/gallery";
import { nav } from "../components/nav";
import { image } from "../types";

import { getModelNames } from "../utils/get-model-names";
import { getRandomImages } from "../utils/get-random-images";

export function randomGallery(limit: number): Promise<string> {
  return new Promise(async function (resolve, reject) {
    try {
      const navElement = nav({ names: await getModelNames(false) });

      const options = {
        pageTitle: `Random Model Images`,
        metaDescription: `Here you'll find ramdom model images`,
        content: navElement + gallery(await getRandomImages(limit)),
      };
      resolve(base(options));
    } catch (err) {
      reject(err);
    }
  });
}
