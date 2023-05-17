import { styleTag } from "./style-tag";

export function base(props: {
    pageTitle: string;
    metaDescription: string;
    content: string;
  }): string {
    return /*html*/ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.pageTitle}</title>
        <meta name="description" content="${props.metaDescription}">
        ${styleTag}
      </head>
      <body>
        ${props.content}
      <script>
          const forms = document.querySelectorAll(".delete-form")
          if(forms){
            forms.forEach(f => f.addEventListener("submit", async (e) => {
                e.preventDefault()
                try {
                    const response = await fetch(e.target.action, {
                        method: "POST",
                    })
                    if(!response.ok){
                        throw response;
                    }
                    e.target.parentElement.remove();
                } catch (err) {
                    console.log(err)
                }
            }))
          }
  
          window.addEventListener("DOMContentLoaded", async function(){
            const items = document.querySelectorAll(".fade-grid-item");
            if(items && items.length){
              for(const item of items){
                item.style.display = "inline-block"
                item.style.visibility = "visible"
                item.classList.add("animate")
                await new Promise(resolve => setTimeout(resolve, 200))
              }
            }
          })
      </script>
      </body>
    </html>`;
  }
