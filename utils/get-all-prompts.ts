import { getDatabaseInstance } from "../db";

export function getAllPrompts(): Promise<string[]> {
  return new Promise(function (resolve, reject) {
    getDatabaseInstance().all("SELECT prompt FROM prompts", (err, rows) =>
      err
        ? reject(err)
        : resolve((rows as { prompt: string }[]).map((r) => r.prompt))
    );
  });
}
