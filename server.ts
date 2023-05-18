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

function creationForm(opts: {
  scenarioPromptArr: {
    scenario: string;
    prompt: string;
  }[];
}): string {
  let scenarioOptionsStr: string = "";
  let scenarioPromptsOptionsStr: string = "";
  for (let i = 0; i < opts.scenarioPromptArr.length; i++) {
    const { scenario, prompt } = opts.scenarioPromptArr[i];
    const newScenario = `<option value="${scenario}">${scenario}</option>`;
    if (!scenarioOptionsStr.includes(newScenario)) {
      scenarioOptionsStr += newScenario;
    }
    scenarioPromptsOptionsStr += `<option value="${prompt}" data-parent="${scenario}">${prompt}</option>`;
  }

  return `<select id="firstInput">
        ${scenarioOptionsStr}
    </select>

    <select id="secondInput">
        ${scenarioPromptsOptionsStr}
    </select>

    <script>
        window.addEventListener("DOMContentLoaded", function(){
             const firstInput = document.getElementById('firstInput');
             const secondInput = document.getElementById('secondInput');

            // Listen for changes in the first selection input
            firstInput.addEventListener('change', function() {
            const selectedOption = firstInput.value; 

            // Filter and add options based on the selected option
            const filteredOptions = Array.from(secondInput.options).filter(function(option) {
                return option.getAttribute('data-parent') === selectedOption;
            });
            
            // Clear previous options in the second input
            secondInput.innerHTML = '';
            
            filteredOptions.forEach(function(option) {
                secondInput.appendChild(option);
            });
            });
    }) 
</script>`;
}

app.get("/create", async function (req, res) {
  try {
    interface scenarioPromptObj {
      scenario: string;
      prompt: string;
    }
    const promptsArr: scenarioPromptObj[] = (await new Promise(function (resolve, reject) {
      db.all("SELECT scenario, prompt FROM prompts", (err, rows) =>
        err
          ? reject(err)
          : resolve(rows as scenarioPromptObj[])
      );
    })) as scenarioPromptObj[];

    res.send(
      base({
        pageTitle: "create a new model",
        metaDescription: "create a new model",
        content: creationForm({ scenarioPromptArr: promptsArr }),
      })
    );
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.get("/all", async function (req, res) {
  try {
    const images: image[] = (await new Promise((r, j) =>
      db.all(
        "SELECT id, file_path as url, prompt, name FROM images ORDER BY RANDOM()",
        (err, rows) => (err ? j(err) : r(rows as image[]))
      )
    )) as image[];

    res.send(base({
      pageTitle: "All images",
      metaDescription: "All images random order",
      content: gallery(images),
    }));
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
