document.addEventListener("DOMContentLoaded", () => {
  const toTopBtn = document.querySelector(".to-top");
  if (!toTopBtn) return; 

  const SCROLL_THRESHOLD = 150; 
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > SCROLL_THRESHOLD) {
          toTopBtn.classList.add("active");
        } else {
          toTopBtn.classList.remove("active");
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  toTopBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
});
