process.env.app = "true";
process.env.siteTitle = "Virtual Vogue";

import express from "express";
import fs from "fs";
import path from "path";
import { getDatabaseInstance } from "./db";
import { home } from "./pages/home";
import { modelGallery } from "./pages/model-gallery";
import { base } from "./components/base";
import { image } from "./types";
import { gallery } from "./components/gallery";
const db = getDatabaseInstance();
const app = express();
app.use(express.json())
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

interface ModelObj {
  name: string;
  description: string;
}

type Models = ModelObj[];


// once a saample has been "tested" another form can be injected to "add to collection" and then the full gallery can be adde
//  the new for should be prepopulated with description and a unique name should be chosen
function creationForm(props: {
    samplePrompt: string;
}){
    return `<div style="max-width: 1200px; margin: auto; padding: 2rem 0;">
        <form id="creation-form">
            <input id="model-description" name="description" type="text" value="light brown hair and blue eyes individual irish girl (kim Kardashian | Emma Watson)" />
            <input id="sample-prompt" type="text" value="${props.samplePrompt}" />
            <input id="prompt-example" name="prompt" value="${props.samplePrompt}" />
            <button>Test</button>
        </form>
        <script>
            window.addEventListener("DOMContentLoaded", async function(){
                try {
                    const modelDescriptionElem = document.getElementById("model-description");
                    const samplePromptElem = document.getElementById("sample-prompt");
                    const promptExampleElem = document.getElementById("prompt-example");
                    function updatePromptExample(){
                        promptExampleElem.value = samplePromptElem.value.replace("influencer_name", modelDescriptionElem.value);
                    }
                    updatePromptExample();
                    for(const elem of [modelDescriptionElem, samplePromptElem]){
                        elem.addEventListener("change", updatePromptExample);
                    }
                    const form = document.getElementById("creation-form");
                    form.addEventListener("submit", async function(e){
                        e.preventDefault()
                        const formData = new FormData(e.target)
                        const body = {};
                        for(const [name, value] of formData){
                            body[name] = value;
                        }
                        const res = await fetch("/create/test", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(body)
                        })
                        if(!res.ok) {
                            throw res;
                        }
                    })
                    

                    } catch (err) {
                    console.error(err)
                }
            })
        </script>
    </div>`
}


app.get("/create", async function (req, res) {
  try {
    const prompt = await new Promise(
        (resolve, reject) => db.get(
            "SELECT prompt FROM prompts ORDER BY RANDOM() LIMIT 1", 
            (err, row) => err ? reject(err) : resolve((row as {prompt: string}).prompt as string))
    ) as string;
    res.send(
      base({
        pageTitle: "create a new model",
        metaDescription: "create a new model",
        content: creationForm({
            samplePrompt: prompt
        }),
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});


// i have changed my mind,
// influencer_name part of the  string is literally just going to be prompt fill
// im going to have one field on the create page accessible only by me
// where i can do stuff like this: Photograph light brown hair and ((blue eyes:8)) individual irish girl (kim Kardashian | [[Emma Watson]]), background cozy coffee shop
// i will literally just test for consistency there, oh I can also choose a name and add themodel to the collection
app.post("/create/test", async function(req, res){
    try {
        console.log(req.body) 
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
})

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
