import { base } from "../components/base";
import { image } from "../types";
import { getImageById } from "../utils/image-queries/get-image-by-id";

export async function editImage(id: string): Promise<string> {
 try {
    const image = await getImageById(id);
  
    return base({
      pageTitle: "Edit Image",
      metaDescription: "Edit the image of your model",
      content: imageEditor(image),
    });
  } catch (err) {
   throw err;
  }
}

function imageEditor(image: image) {
  return /*html*/ `<div style="display:flex">
        <div><img src="/${image.url}" /></div>
        <div>
            <button>Hello</button>
        </div>
  </div>`;
}
