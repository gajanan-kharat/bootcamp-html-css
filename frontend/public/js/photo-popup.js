document.addEventListener("DOMContentLoaded", () => {
  const popupLinks = document.querySelectorAll(".popup-link");
  const modal = document.getElementById("popup-modal");
  const modalImage = document.getElementById("modal-image");
  const closeBtn = document.querySelector(".close-btn");

  if (!modal || !modalImage || !closeBtn) return; // safety guard

  popupLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      modal.style.display = "block";
      modalImage.src = link.href;
    });
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    modalImage.src = ""; 
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      modalImage.src = "";
    }
  });
});

