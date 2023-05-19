import Replicate from "replicate";
import dotenv from "dotenv";
import download from "image-downloader";
import path from "path";
import crypto from "crypto";
import { getDatabaseInstance } from "./db";

const db = getDatabaseInstance();

dotenv.config();

const auth = process.env.REPLICATE_API_TOKEN!;

const replicate = new Replicate({ auth });

const model =
  "mcai/realistic-vision-v2.0:63ed33a0e79013860417f5a9d45f8a53f0b2f1963bdf1d05259c5cbcf2d70107";

const models = [
  [
    "odette-jenner",
    "dark brown hair and (((blue eyes:8))) individual irish girl (Odette Yustman | [[[Kylie Jenner]]])",
  ],
  [
    "ana-agron",
    "dark blonde, blue-eyed individual irish girl (Ana de Armas | Diana Agron)",
  ],
  [
    "alba-biel",
    "dark blonde, blue-eyed individual irish girl (Jessica Alba | Jessica Biel)",
  ],
  [
    "birgitte-agron",
    "dark blonde, blue-eyed individual irish woman (Birgitte Hjort Sørensen | Dianna Agron)",
  ],
  [
    "birgitte-sweeney",
    "dark blonde, blue-eyed individual irish woman (Birgitte Hjort Sørensen | Sydney Sweeney)",
  ],
  [
    "liana-sweeney",
    "dark blonde, blue-eyed individual irish girl (Liana Liberato | Sydney Sweeney)",
  ],
  [
    "liana-agron",
    "dark blonde, blue-eyed individual irish girl (Liana Liberato | Dianna Agron)",
  ],
  [
    "zoey-agron",
    "dark blonde, blue-eyed individual irish girl (Zoey Deutch | Dianna Agron),",
  ],
  [
    "florence-agron",
    "dark blonde, blue-eyed individual irish girl (Florence Pugh | Dianna Agron)",
  ],
  [
    "diana-justice",
    "blonde, blue-eyed individual (Dianna Agron | Victoria Justice)",
  ],
];

const [name, influencerName] = models[0];

async function main() {
  const prompts: string[] = (
    (await new Promise(function (resolve, reject) {
      db.all("SELECT prompt FROM prompts", (err, rows) =>
        err ? reject(err) : resolve(rows as { prompt: string }[])
      );
    })) as { prompt: string }[]
  ).map((p) => p.prompt);

  for (let i = 0; i < prompts.length; i++) {
    try {
      const prompt = prompts[i].replace("influencer_name", influencerName);

      console.log(`run ${i + 1}/${prompts.length}`, prompt);

      const output = await replicate.run(model, {
        input: {
          prompt,
          negative_prompt:
            "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
        },
      });

      const [replicateImgUrl] = output as string[];

      await new Promise(async function (resolve, reject) {
        try {
          const generateRandomString = (length: number): string => {
            const bytes = crypto.randomBytes(Math.ceil(length / 2));
            return bytes.toString("hex").slice(0, length);
          };

          const filePath =
            "images" + "/" + name + generateRandomString(5) + ".png";

          const options = {
            url: replicateImgUrl,
            dest: path.resolve(__dirname, filePath),
          };

          await download.image(options);

          db.run(
            "INSERT INTO  images(url, prompt, name, model, file_path) VALUES(?, ?, ?, ?, ?)",
            [replicateImgUrl, prompt, name, model, filePath],
            (err) => (err ? reject(err) : resolve(err))
          );
        } catch (err) {
          reject(err);
        }
      });
      console.log(`img saved`);
    } catch (err) {
      console.log(err);
    }
  }
}

main();
