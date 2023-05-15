import Replicate from "replicate";
import dotenv from "dotenv";
import sqlite from "sqlite3";
import { prompts } from "./prompts";

const db = new sqlite.Database("main.db");

dotenv.config();

const auth = process.env.REPLICATE_API_TOKEN!;

const replicate = new Replicate({ auth });

const model = "mcai/realistic-vision-v2.0:63ed33a0e79013860417f5a9d45f8a53f0b2f1963bdf1d05259c5cbcf2d70107";

const name = "zoey-agron"
// "diana-justice"
//"florence-agron"
const influencerName = "dark blonde, blue-eyed individual irish girl (Zoey Deutch | Dianna Agron),"
//"dark blonde, blue-eyed individual irish girl (Florence Pugh | Dianna Agron)"
  //"blonde, blue-eyed individual (Dianna Agron | Victoria Justice)";

async function main() {
  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i].replace("influencer_name", influencerName);
    console.log(`run ${i+1}/${prompts.length}`, prompt)


    const output = await replicate.run(
      model,
      {
        input: {
          prompt,
          negative_prompt:
            "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
        },
      }
    );

    const [img] = output as string[];

    console.log(img);

    try {
      await new Promise(function (resolve, reject) {
        db.run(
          "INSERT INTO  images(url, prompt, name, model) VALUES(?, ?, ?, ?)",
          [img, prompt, name, model],
          (err) => (err ? reject(err) : resolve(err))
        );
      });
      console.log(`img saved`);
    } catch (err) {
      console.log(err);
    }
  }
}

main();
