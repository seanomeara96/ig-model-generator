import { image } from "../types";
import { imageCard } from "./image-card";

export function gallery(images: image[]): string {
    let imageCards = "";
    for (let i = 0; i < images.length; i++) {
      imageCards += imageCard(images[i]);
    }
    return /*HTML*/ `<div id="container">${imageCards}</div>`;
  }