import { getDatabaseInstance } from "../db";
import { image } from "../types";
const db = getDatabaseInstance();

export function getRandomModelImage(modelName: string): Promise<image[]> {
  return new Promise(function (resolve, reject) {
    db.all(
      /*SQL*/ `SELECT id, file_path as url, prompt, name FROM images WHERE name = ? ORDER BY RANDOM() LIMIT 1`,
      [modelName],
      (err, rows) => (err ? reject(err) : resolve(rows as image[]))
    );
  });
}
