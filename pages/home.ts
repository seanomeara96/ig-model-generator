import { base } from "../components/base";
import { heroGrid } from "../components/hero-grid";

import { image } from "../types";
import { getModelNames } from "../utils/get-model-names";
import { getRandomModelImages } from "../utils/image-queries/get-random-model-images";

export function home(): Promise<string> {
  return new Promise(async function (resolve, reject) {
    try {
      const models = await getModelNames(true);
      const modelImages: image[][] = [];
      for (let i = 0; i < models.length; i++) {
        const model = models[i];
        try {
          const images: image[] = await getRandomModelImages(model.name);
          modelImages.push(images);
        } catch (err) {
          console.log(err);
          continue;
        }
      }

      const content = heroGrid(modelImages);

      const data = {
        pageTitle: "AI Model Gallery",
        metaDescription: "Here you'll find a gallery  of AI generated models",
        content: content,
      };

      resolve(base(data));
    } catch (err) {
      reject(err);
    }
  });
}
