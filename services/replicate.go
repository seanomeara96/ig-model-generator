package services

//import Replicate from "replicate";

/*export function run(prompt: string): Promise<string> {
  return new Promise(async function (resolve, reject) {
    try {
      const options = {
        input: {
          prompt,
          negative_prompt:
            "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
        },
      };
      const output = (await new Replicate({
        auth: process.env.REPLICATE_API_TOKEN!,
      }).run(
        process.env.REPLICATE_MODEL! as `${string}/${string}:${string}`,
        options
      )) as string[];
      resolve(output[0]);
    } catch (err) {
      reject(err);
    }
  });
}*/
