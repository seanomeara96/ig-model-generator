import { image } from "../types";
import { formatName } from "../utils/format-name";
import { imageCard } from "./image-card";

export function heroGrid(imagesCollection: image[][], limit = 5) {
  if (
    !imagesCollection.length ||
    !imagesCollection.reduce((a, c) => a + c.length, 0)
  ) {
    console.log(new Error("no images supplied to hero grid"));
  }

  let gridImages = ``;
  for (let i = 0; i < limit; i++) {
    const images = imagesCollection[i];

    for (let ii = 0; ii < images.length; ii++) {
      const img = images[ii];
      const formattedName = formatName(img.name);
      const imgCard = imageCard(img);

      gridImages += /*html*/ `<a 
        class="fade-grid-item" 
        style="display: none; color: inherit; text-decoration: none;" 
        href="/models/${img.name}">${imgCard}<h2>${formattedName}</h2></a>`;
    }
  }

  return /*html*/ `
    <div class="img-grid">
      ${gridImages}
    </div>
    `;
}
