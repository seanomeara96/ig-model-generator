import { image } from "../types";
export function imageCard(img: image) {
    return /*HTML*/ `<div class="fade-grid-item" style="visibility: hidden; position:relative">
          <img src="/${img.url}" alt="${img.prompt}"/>
          ${process.env.app === "true" ? /*HTML*/`<form 
          class="delete-form"
          style="position: absolute; bottom:0 ; right: 0;" 
          method="POST" 
          action="/images/${img.id}/delete"
          >
            <button>Delete</button>
        </form>` : ''}
      </div>`;
  }