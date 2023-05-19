import { getDatabaseInstance } from "../../db";
import { image } from "../../types";
const db = getDatabaseInstance();
export function getAllModelImages(
  hyphenatedModelName: string
): Promise<image[]> {
  return new Promise(function (resolve, reject) {
    db.all(
      /*SQL*/ `SELECT id, file_path as url, prompt, name FROM images WHERE name = ?`,
      [hyphenatedModelName],
      (err, rows) => (err ? reject(err) : resolve(rows as image[]))
    );
  });
}
