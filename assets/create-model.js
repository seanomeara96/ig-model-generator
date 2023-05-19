window.addEventListener("DOMContentLoaded", async function () {
  try {
    // test form elements
    const modelDescriptionElem = document.getElementById("model-description");
    const samplePromptElem = document.getElementById("sample-prompt");
    const promptExampleElem = document.getElementById("prompt-example");

    //create gallery form elements
    const createGalleryForm = document.getElementById("create-gallery-form");
    const modelNameElem = document.getElementById("model-name");
    const modelDescriptionFinalElem = document.getElementById(
      "model-description-final"
    );

    function updatePromptExample() {
      promptExampleElem.value = samplePromptElem.value.replace(
        "influencer_name",
        modelDescriptionElem.value
      );
    }
    updatePromptExample();
    for (const elem of [modelDescriptionElem, samplePromptElem]) {
      elem.addEventListener("change", updatePromptExample);
    }
    const testForm = document.getElementById("creation-form");
    testForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const body = {};
      for (const [name, value] of formData) {
        body[name] = value;
      }
      const res = await fetch("/create/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw res;
      }
      const data = await res.json();
      const imageContainer = document.querySelector("#image-container");
      imageContainer.insertAdjacentHTML(
        "afterbegin",
        '<img style="display: block; margin: auto; width: 100%" src="' +
          data.image +
          '"/>'
      );

      createGalleryForm.style.display = "flex";
      modelDescriptionFinalElem.value = modelDescriptionElem.value;
    });

    createGalleryForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const body = {};
      for (const [name, value] of formData) {
        body[name] = value;
      }
      if (!body.name || !body.name.length) {
        throw "must provide a hyphenated name";
      }
      if (!body.description || !body.description.length) {
        throw "must provide a description";
      }
      const res = await fetch("/create/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw res;
      }

      createGalleryForm.insertAdjacentHTML(
        "afterend",
        '<div>Keep an eye out for your <a href="/models/' +
          body.name +
          '">new model here</a></div>'
      );
    });
  } catch (err) {
    console.log(err);
  }
});
