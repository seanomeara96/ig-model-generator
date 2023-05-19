import download from "image-downloader";
import path from "path";
import crypto from "crypto";
import { getDatabaseInstance } from "./db";
import { run } from "./replicate/run";
import { getAllPrompts } from "./utils/get-all-prompts";
const db = getDatabaseInstance();

const generateRandomString = (length: number): string => {
  const bytes = crypto.randomBytes(Math.ceil(length / 2));
  return bytes.toString("hex").slice(0, length);
};

export async function createGallery(name: string, description: string) {
  try {
    const prompts: string[] = await getAllPrompts();

    for (let i = 0; i < prompts.length; i++) {
      try {
        const prompt = prompts[i].replace("influencer_name", description);

        console.log(`run ${i + 1}/${prompts.length}`, prompt);

        const replicateImgUrl = await run(prompt);

        await new Promise(async function (resolve, reject) {
          try {
            const filePath =
              "images" + "/" + name + generateRandomString(5) + ".png";

            const options = {
              url: replicateImgUrl,
              dest: path.resolve(__dirname, filePath),
            };

            await download.image(options);

            db.run(
              "INSERT INTO  images(url, prompt, name, model, file_path) VALUES(?, ?, ?, ?, ?)",
              [
                replicateImgUrl,
                prompt,
                name,
                process.env.REPLICATE_MODEL,
                filePath,
              ],
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
  } catch (err) {
    console.log(err);
  }
}
