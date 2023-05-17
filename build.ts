process.env.app = "false";
process.env.siteTitle = "Virtual Vogue";

import fs from "fs";
import path from "path";
import { home } from "./pages/home";
import { getModelNames } from "./utils/get-model-names";
import { modelGallery } from "./pages/model-gallery";

async function main() {
  try {
    await clearBuildFolder();
    createDirectory("build");
    createDirectory("build/images");
    createDirectory("build/models");
    await copyImageFolder();
    await renderHomePage();
    for (const model of await getModelNames(false)) {
      await renderModelGallery(model.name);
    }
  } catch (err) {
    console.log(err);
  }
}
main();

function renderModelGallery(name: string) {
  return new Promise(async function (resolve, reject) {
    try {
      const content = await modelGallery(name);
      createDirectory(`build/models/${name}`)
      fs.writeFileSync(`./build/models/${name}/index.html`, content, {
        encoding: "utf-8",
      });
      resolve(true);
      console.log(`ouputed gallery for ${name} at ${name}.html`);
    } catch (err) {
      reject(err);
    }
  });
}

function renderHomePage() {
  return new Promise(async function (resolve, reject) {
    try {
      fs.writeFileSync("./build/index.html", await home(), {
        encoding: "utf-8",
      });
      resolve(true);
      console.log("created homepage at index.html");
    } catch (err) {
      reject(err);
    }
  });
}

function createDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    console.log(" directory created.");
  } else {
    console.log(" directory already exists.");
  }
}

function copyImageFolder(source = "./images", destination = "build/images") {
  return new Promise(function (resolve, reject) {
    if (fs.existsSync(source)) {
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination);
      }

      const files = fs.readdirSync(source);

      files.forEach((file: any) => {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);

        if (fs.lstatSync(sourcePath).isDirectory()) {
          copyImageFolder(sourcePath, destinationPath);
        } else {
          fs.copyFileSync(sourcePath, destinationPath);
        }
      });

      console.log(`Folder copied from ${source} to ${destination}`);
      resolve(undefined);
    } else {
      reject(undefined);
    }
  });
}

function clearBuildFolder(path = "./build") {
  return new Promise(function (resolve, reject) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function (file) {
        const curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) {
          // Recursive call for directories
          clearBuildFolder(curPath);
        } else {
          // Delete file
          fs.unlinkSync(curPath);
        }
      });

      fs.rmdirSync(path);
      console.log(`Directory ${path} emptied successfully.`);
      // Usage
      resolve(undefined);
    } else {
      console.log(`Directory ${path} does not exist.`);
      resolve(undefined);
    }
  });
}
