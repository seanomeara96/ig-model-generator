import { getDatabaseInstance } from "../db";
const db = getDatabaseInstance();

export function getModelNames(
  randomOrder: boolean
): Promise<{ name: string }[]> {
  return new Promise(function (resolve, reject) {
    db.all(
      "SELECT DISTINCT name FROM images" +
        (randomOrder ? " ORDER BY RANDOM()" : ""),
      (err, rows) => (err ? reject(err) : resolve(rows as { name: string }[]))
    );
  });
}
