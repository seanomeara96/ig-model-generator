import { image } from "../types";
export function imageCard(img: image) {
  return /*HTML*/ `<div class="fade-grid-item" style="visibility: hidden; position:relative">
          <img src="/${img.url}" alt="${img.prompt}"/>
          
          ${
            process.env.app === "true"
              ? /*HTML*/ `<div style="position: absolute; bottom:0;  display: flex; gap: 1rem" >
            <button><a href="/images/${img.id}/edit">Edit</a></button>
            <form 
              class="delete-form"
              method="POST" 
              action="/images/${img.id}/delete"
              >
                <button>Delete</button>
            </form>
          </div>`
              : ""
          }
      </div>`;
}
