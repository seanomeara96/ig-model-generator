const forms = document.querySelectorAll(".delete-form");
if (forms) {
  forms.forEach((f) =>
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(e.target.action, {
          method: "POST",
        });
        if (!response.ok) {
          throw response;
        }
        e.target.parentElement.remove();
      } catch (err) {
        console.log(err);
      }
    })
  );
}

const items = document.querySelectorAll(".fade-grid-item");
if (items) {
  window.addEventListener("DOMContentLoaded", async function () {
    if (items && items.length) {
      for (const item of items) {
        item.style.display = "inline-block";
        item.style.visibility = "visible";
        item.classList.add("animate");
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
  });
}
