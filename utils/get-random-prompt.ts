import { getDatabaseInstance } from "../db";

export function getRandomPrompt(): Promise<string> {
  return new Promise((resolve, reject) =>
    getDatabaseInstance().get(
      "SELECT prompt FROM prompts ORDER BY RANDOM() LIMIT 1",
      (err, row) =>
        err
          ? reject(err)
          : resolve((row as { prompt: string }).prompt as string)
    )
  );
}
