import { getDatabaseInstance } from "../db";
import { image } from "../types";

export function getRandomImages(limit = 5): Promise<image[]> {
  return new Promise(function (resolve, reject) {
    getDatabaseInstance().all(
      "SELECT id, file_path as url, prompt, name FROM images ORDER BY RANDOM() LIMIT ?",
      [limit],
      (err, rows) => (err ? reject(err) : resolve(rows as image[]))
    );
  });
}
