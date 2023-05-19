import { getDatabaseInstance } from "../../db";
import { getImageFilePathById } from "./get-image-file-path-by-id";
import fs from "fs";

export function deleteImageById(id: string): Promise<boolean> {
  return new Promise(async function (resolve, reject) {
    try {
      if (isNaN(id as any)) return reject(new Error(`typeof id is not number`));

      const filePath: string = await getImageFilePathById(id);

      if (!filePath || !filePath.length) return reject("No filepath");

      fs.unlink(filePath, (err) => {
        if (err) return reject(err);

        getDatabaseInstance().run(
          "DELETE FROM images WHERE  id = ?",
          [id],
          (err) => (err ? reject(err) : resolve(true))
        );
      });
    } catch (err) {
      reject(err);
    }
  });
}
