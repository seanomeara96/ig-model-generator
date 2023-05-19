process.env.app = "true";
process.env.siteTitle = "Virtual Vogue";

import express from "express";
import path from "path";
import { getDatabaseInstance } from "./db";
import { home } from "./pages/home";
import { modelGallery } from "./pages/model-gallery";
import { run } from "./replicate/run";
import dotenv from "dotenv";
import { createGallery } from "./create-gallery";
import { getRandomPrompt } from "./utils/get-random-prompt";
import { createNewModel } from "./pages/create-new-model";
import { deleteImageById } from "./utils/delete-image-by-id";

dotenv.config();
const db = getDatabaseInstance();
const app = express();
app.use(express.json());
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

app.get("/create", async function (req, res) {
  try {
    const prompt = await getRandomPrompt();
    res.send(createNewModel(prompt));
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/create/test", async function (req, res) {
  try {
    if (!req.body.prompt) {
      throw "no prompt";
    }
    res.json({ image: await run(req.body.prompt) });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/create/gallery", function (req, res) {
  try {
    const { name, description } = req.body;
    const params: { name: string; description: string } = { name, description };
    if (
      !params.name ||
      !params.name.length ||
      !params.description ||
      !params.description.length
    ) {
      throw new Error("Invalid user input");
    }
    createGallery(params.name, params.description);
    res.sendStatus(200);
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
    await deleteImageById(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("listening"));
