import { getDatabaseInstance } from "../../db";
import { image } from "../../types";

export function getImageById(id: string): Promise<image> {
  return new Promise(function (resolve, reject) {
    try {
      getDatabaseInstance().get(
        "SELECT id, file_path as url, prompt, name FROM images WHERE id = ?",
        [id],
        (err, row) => (err ? reject(err) : resolve(row as image))
      );
    } catch (err) {
      reject(err);
    }
  });
}
