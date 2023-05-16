import express from "express";
import sqlite from "sqlite3";
import fs from "fs";
import path from "path"
const db = new sqlite.Database("main.db");

const app = express();

// Configure the static images folder
app.use("/images", express.static(path.join(__dirname, "images")));

function body(content: string) {
  return /*html*/`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Model Gallery</title>
    
        <style>
          #container {
            display: flex;
            flex-wrap: wrap;
          }
    
          #container div {
            width: 100%;
          }
          
          #container div img {
            width: 100%;
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
        </style>
      </head>
      <body>
        ${content}
      <script>
          document.querySelectorAll("#container div form")
            .forEach(f => f.addEventListener("submit", async (e) => {
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
      </script>
      </body>
    </html>
    `;
}

function card(obj: any) {
  return /*HTML*/`<div style="position:relative">
        <img src="/${obj.url}" alt="${obj.prompt}"/>
        <form style="position: absolute; bottom:0 ; right: 0;" method="POST" action="/images/${obj.id}/delete">
            <button>Delete</button>
        </form>
    </div>`;
}

function renderImages(images: any[]): string {
  const imageCards = images.map((i: any) => card(i)).join("");
  return /*HTML*/`<div id="container">${imageCards}</div>`;
}

function getModelNames(): Promise<any[]> {
  return new Promise(function (resolve, reject) {
    db.all("SELECT DISTINCT name FROM images", (err, rows) =>
      err ? reject(err) : resolve(rows)
    );
  });
}

function renderNav(opts: any): string {
  return /*HTML*/`<nav>
    ${opts.names
      .map(
        (n: any) =>
          /*HTML*/`<a style="padding: 20px" href="/models/${n.name}">${n.name
            .split("-")
            .join(" ")}</a>`
      )
      .join("")}
</nav>`;
}

app.get("/", async function (req, res) {
  try {
    const images: any[] = await new Promise(function (resolve, reject) {
      db.all("SELECT id, file_path as url, prompt FROM images", (err, rows) =>
        err ? reject(err) : resolve(rows)
      );
    });

    const content = renderImages(images);

    const names: any[] = await getModelNames();

    const nav = renderNav({ names });

    res.send(body(nav + content));
  } catch (err) {
    console.log(err)
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

    const names: any[] = await getModelNames();

    const nav = renderNav({ names });

    res.send(body(nav + content));
  } catch (err) {
    console.log(err)
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
    })


    if(!row){
      throw "no results"
    }

    const pathToImg = row.file_path

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
    console.log(err)
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("listening"));
