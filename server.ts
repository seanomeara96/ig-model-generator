import express from "express";
import sqlite from "sqlite3";
import fs from "fs";
import path from "path";
const db = new sqlite.Database("main.db");
const siteTitle = "Virtual Vogue";
const app = express();

// Configure the static images folder
app.use("/images", express.static(path.join(__dirname, "images")));

function base(props: {
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
      <title>Model Gallery</title>
      <meta name="description" content="${props.metaDescription}">
      <style>

        html,body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
        }        

        header {
          background-color: #333;
          color:#fff;
        }

        header h1 {
          margin:0;
          padding-top: 20px;
        }

        header h1 {
          text-align: center;
        }

        nav {
            display: flex;
            justify-content: center;
            
        }
        
        nav ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
        }
        
        nav li {
            display: inline-block;
            margin: 10px;
        }
        
        nav a {
            display: block;
            padding: 10px;
            color: #fff;
            text-decoration: none;
            transition: background-color 0.3s ease;
        }
        
        nav a:hover {
            background-color: #666;
        }

        .img-grid {
          width: 100%;
          display: flex;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 1fr);
        }

        .img-grid > * {
          width: 20%;
          height: 100%;
          position: relative;
          aspect-ratio:512/768;
        }

        .img-grid > * > div{
          width: 100%;
          height: 100%;
          position: relative;
          aspect-ratio:512/768;
        }

        .img-grid > * img {
          position: absolute;
          top:0 ;
          left:0;
          width:100%;
          height: 100%;
          object-position: bottom;
          object-fit: cover;
        }

        #container {
          display: flex;
          flex-wrap: wrap;
        }
  
        #container div {
          width: 100%;
        }
        
        #container div img {
          width: 100%;
          aspect-ratio:512/768;
        }
  
        @media (min-width: 500px) {
          #container div {
            width: 50%;
          }
        }
  
        @media (min-width: 800px) {
          #container div {
            width: 33.33%;
          }
        }
  
        @media (min-width: 1000px) {
          #container div {
            width: 25%;
          }
        }
  
        @media (min-width: 1300px) {
          #container div {
            width: 10%;
          }
        }
        @keyframes fadein {
          from {
            opacity: .0;
            transform: scale(1.2)
          }
          to {
            opacity: 1;
            transform: scale(1)
          }
        }
        .animate {
          animation-name: fadein;
          animation-duration: 1s;
        }
      </style>
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

function card(img: image) {
  return /*HTML*/ `<div class="fade-grid-item" style="visibility: hidden; position:relative">
        <img src="/${img.url}" alt="${img.prompt}"/>
        <form 
          class="delete-form"
          style="position: absolute; bottom:0 ; right: 0;" 
          method="POST" 
          action="/images/${img.id}/delete"
          >
            <button>Delete</button>
        </form>
    </div>`;
}

function renderImages(images: image[]): string {
  let imageCards = "";
  for (let i = 0; i < images.length; i++) {
    imageCards += card(images[i]);
  }
  return /*HTML*/ `<div id="container">${imageCards}</div>`;
}

function getModelNames(randomOrder: boolean): Promise<{ name: string }[]> {
  return new Promise(function (resolve, reject) {
    db.all(
      "SELECT DISTINCT name FROM images" +
        (randomOrder ? " ORDER BY RANDOM()" : ""),
      (err, rows) => (err ? reject(err) : resolve(rows as { name: string }[]))
    );
  });
}

function formatName(hyphenatedLowerCaseName: string): string {
  function sentenceCase(sentence: string | string[]) {
    const words = Array.isArray(sentence) ? sentence : sentence.split(" ");
    const res: string[] = [];
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      res.push(word[0].toUpperCase() + word.substring(1));
    }
    return res.join(" ");
  }
  return sentenceCase(hyphenatedLowerCaseName.split("-"));
}

function renderNav(opts: any): string {
  let navItems = `<li><a href="/">Home</a></li>`;
  for (let i = 0; i < opts.names.length; i++) {
    const { name } = opts.names[i];
    const formattedName = formatName(name);
    navItems += `<li><a  href="/models/${name}">${formattedName}</a></li>`;
  }
  return /*HTML*/ `
  <header>
  <h1>${siteTitle}</h1>
  <nav>  
    <ul>${navItems}</ul>
  </nav>
  </header>
  `;
}

interface image {
  id: number;
  url: string;
  prompt: string;
  name?: string;
}

app.get("/", async function (req, res) {
  try {
    const modelNames = await getModelNames(true);

    interface modelImage {
      name: string;
      images?: image[];
    }

    const modelImages: modelImage[] = [];
    for (const { name } of modelNames) {
      modelImages.push({ name });
    }

    for (let i = 0; i < modelImages.length; i++) {
      const model = modelImages[i];
      try {
        const images: image[] = await new Promise(function (resolve, reject) {
          db.all(
            /*SQL*/ `SELECT id, file_path as url, prompt FROM images WHERE name = ? ORDER BY RANDOM() LIMIT 1`,
            [model.name],
            (err, rows) => (err ? reject(err) : resolve(rows as image[]))
          );
        });
        model.images = images;
      } catch (err) {
        console.log(err);
        continue;
      }
    }

    let content = "";

    let gridImages = ``;
    for (let i = 0; i < 5; i++) {
      const modelImage = modelImages[i];
      if (modelImage.images) {
        for (let ii = 0; ii < modelImage.images.length; ii++) {
          const img = modelImage.images[ii];
          gridImages += `<a class="fade-grid-item" style="display: none; color: inherit; text-decoration: none;" href="/models/${
            modelImage.name
          }">${card(img)}<h2>${formatName(modelImage.name)}</h2></a>`;
        }
      }
    }

    const grid = /*html*/ `
    <div class="img-grid">
      ${gridImages}
    </div>
    `;

    content += grid;

    const nav = renderNav({ names: await getModelNames(false) });

    const data = {
      pageTitle: "AI Model Gallery",
      metaDescription: "Here you'll find a gallery  of AI generated models",
      content: nav + content,
    };

    res.send(base(data));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/models/:name", async function (req, res) {
  try {
    const images: any[] = await new Promise(function (resolve, reject) {
      db.all(
        "SELECT id, file_path as url, prompt FROM images WHERE name = ?",
        [req.params.name],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });
    const content = renderImages(images);

    const nav = renderNav({ names: await getModelNames(false) });

    res.send(
      base({
        pageTitle: `Gallery for model: ${req.params.name}`,
        metaDescription: `Here you'll find images of ${req.params.name}`,
        content: nav + content,
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/images/:id/delete", async function (req, res) {
  try {
    const row: any = await new Promise(function (resolve, reject) {
      db.get(
        "SELECT file_path FROM images WHERE id = ?",
        [req.params.id],
        (err, row) => (err ? reject(err) : resolve(row))
      );
    });

    if (!row) {
      throw "no results";
    }

    const pathToImg = row.file_path;

    await new Promise(function (resolve, reject) {
      fs.unlink(pathToImg, (err) => (err ? reject(err) : resolve(true)));
    });

    await new Promise(function (resolve, reject) {
      db.run("DELETE FROM images WHERE  id = ?", [req.params.id], (err) =>
        err ? reject(err) : resolve(true)
      );
    });
    
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("listening"));
