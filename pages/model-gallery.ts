import { base } from "../components/base";
import { gallery } from "../components/gallery";
import { nav } from "../components/nav";
import { getAllModelImages } from "../utils/get-all-model-images";
import { getModelNames } from "../utils/get-model-names";

export function modelGallery(name: string): Promise<string> {
  return new Promise(async function (resolve, reject) {
    try {
      const images: any[] = await getAllModelImages(name);
      const content = gallery(images);

      const navElement = nav({ names: await getModelNames(false) });

      const options = {
        pageTitle: `Gallery for model: ${name}`,
        metaDescription: `Here you'll find images of ${name}`,
        content: navElement + content,
      };
      resolve(base(options));
    } catch (err) {
      reject(err);
    }
  });
}
