import { getModelNames } from "../utils/get-model-names";
import { nav } from "./nav";
import { styleTag } from "./style-tag";

export async function base(props: {
  pageTitle: string;
  metaDescription: string;
  content: string;
}): Promise<string> {
  return /*html*/ `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${props.pageTitle}</title>
        <meta name="description" content="${props.metaDescription}">
        <link rel="stylesheet" href="/assets/index.css">
        ${styleTag}
      </head>
      <body>
        ${nav({ names: await getModelNames(false) })}
        ${props.content}
        <script src="/assets/index.js"></script>
      </body>
    </html>`;
}
