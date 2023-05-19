import { getDatabaseInstance } from "../../db";
import { image } from "../../types";
const db = getDatabaseInstance();

export function getRandomModelImages(
  modelName: string,
  limit = 1
): Promise<image[]> {
  return new Promise(function (resolve, reject) {
    db.all(
      /*SQL*/ `SELECT id, file_path as url, prompt, name FROM images WHERE name = ? ORDER BY RANDOM() LIMIT ?`,
      [modelName, limit],
      (err, rows) => (err ? reject(err) : resolve(rows as image[]))
    );
  });
}
