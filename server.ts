process.env.app = "true";
process.env.siteTitle = "Virtual Vogue";

import express from "express";
import fs from "fs";
import path from "path";
import { getDatabaseInstance } from "./db";
import { home } from "./pages/home";
import { modelGallery } from "./pages/model-gallery";

const db = getDatabaseInstance();
const app = express();

// Configure the static images folder
app.use("/images", express.static(path.join(__dirname, "images")));

app.get("/", async function (req, res) {
  try {
    res.send(await home());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/models/:name", async function (req, res) {
  try {
    res.send(await modelGallery(req.params.name));
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
