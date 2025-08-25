document.addEventListener("DOMContentLoaded", () => {
  const acc = document.querySelectorAll(".accordion");
  acc.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      button.parentElement.classList.toggle("active");

      const panel = button.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  });
});
