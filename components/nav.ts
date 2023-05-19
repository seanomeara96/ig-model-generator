import { formatName } from "../utils/format-name";

export function nav(opts: any): string {
  let navItems = /*HTML*/ `<li><a href="/">Home</a></li>`;

  // added model names
  for (let i = 0; i < opts.names.length; i++) {
    const { name } = opts.names[i];
    const formattedName = formatName(name);
    navItems += /*HTML*/ `<li><a  href="/models/${name}">${formattedName}</a></li>`;
  }

  return /*HTML*/ `
    <header>
        <h1>${process.env.siteTitle}</h1>
        <nav>  
            <ul>${navItems}</ul>
        </nav>
    </header>
    `;
}
