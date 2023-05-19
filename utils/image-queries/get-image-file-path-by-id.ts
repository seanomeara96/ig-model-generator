import { getDatabaseInstance } from "../../db";

export function getImageFilePathById(id: string): Promise<string> {
  return new Promise(function (resolve, reject) {
    if (isNaN(id as any))
      return reject(new Error("expected id to be a number"));
    getDatabaseInstance().get(
      "SELECT file_path FROM images WHERE id = ?",
      [id],
      (err, row) =>
        err ? reject(err) : resolve((row as { file_path: string }).file_path)
    );
  });
}
