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

const observer = new IntersectionObserver(async function (entries) {
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.isIntersecting) {
      // do this
      entry.target.classList.remove("fade-grid-item--hidden");
      entry.target.classList.add("animate");
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
});

const images = document.querySelectorAll(".fade-grid-item");
for (const img of images) {
  observer.observe(img);
}
