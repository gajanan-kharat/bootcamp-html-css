export function initializeGrtYoutube(options = {}) {
    const settingsDefaults = {
        autoPlay: true,
        theme: "dark", 
    };

    const settings = { ...settingsDefaults, ...options };

    settings.autoPlay = settings.autoPlay === true ? 1 : 0;
    settings.theme =
        settings.theme === "dark"
            ? "grtyoutube-dark-theme"
            : settings.theme === "light"
                ? "grtyoutube-light-theme"
                : settings.theme;

    const elements = document.querySelectorAll(".youtube-link");

    elements.forEach((el) => {
        const videoIDAttr = el.getAttribute("youtubeid");
        const videoID = videoIDAttr || settings.videoID;
        if (!videoID) return;

        el.addEventListener("click", (event) => {
            event.preventDefault();

            const popup = document.createElement("div");
            popup.className = `grtyoutube-popup ${settings.theme}`;
            popup.innerHTML = `
        <div class="grtyoutube-popup-content">
          <span
            class="grtyoutube-popup-close ${settings.theme === "grtyoutube-light-theme" ? "light-theme" : ""}"
            role="button"
            aria-label="Close popup"
            tabindex="0"></span>
          <iframe
            class="grtyoutube-iframe"
            src="https://www.youtube.com/embed/${videoID}?rel=0&wmode=transparent&autoplay=${settings.autoPlay}&iv_load_policy=3"
            allowfullscreen
            frameborder="0">
          </iframe>
        </div>`;

            document.body.appendChild(popup);

            const closeBtn = popup.querySelector(".grtyoutube-popup-close");

            closeBtn.addEventListener("click", () => {
                popup.remove();
            });

            closeBtn.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    popup.remove();
                }
            });

            popup.addEventListener("click", (e) => {
                if (e.target === popup) popup.remove();
            });

            function escListener(event) {
                if (event.key === "Escape") {
                    popup.remove();
                    document.removeEventListener("keyup", escListener);
                }
            }
            document.addEventListener("keyup", escListener);
        });
    });
}
