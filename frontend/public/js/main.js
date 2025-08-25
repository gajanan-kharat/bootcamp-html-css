import { fetchConfig } from "./config.js";
import { parseEventDate } from "./dateUtils.js";
import { bindConfigToUI } from "./dynamicValues.js";
import { startCountdowns } from "./countdown.js";
import { initCarousel1, initCarousel2 } from "./components/carousel.js";
import { initializeGrtYoutube } from "./components/grtYoutubePopup.js";
import "./registration_popup.js";
import "./photo-popup.js";
import "./to_Top.js";
import "./FAQ_logic.js";


window.AppConfig = {};

async function init() {
  const cfg = await fetchConfig();

  if (cfg.bootcampDate) {
    const parsed = parseEventDate(cfg.bootcampDate);
    cfg.bootcampStartDate = parsed.startDateObj;
    cfg.bootcampEndDate = parsed.endDateObj;
    cfg.bootcampDuration = parsed.duration;
    cfg.bootcampStartPretty = parsed.startPretty;
  }

  window.AppConfig = cfg;
  console.log("✅ Config loaded:", cfg);

  bindConfigToUI(cfg);
  startCountdowns(cfg);

  document.dispatchEvent(new CustomEvent("configLoaded", { detail: cfg }));
}

document.addEventListener("DOMContentLoaded", init);

document.addEventListener("DOMContentLoaded", () => {
  initializeGrtYoutube({ autoplay: true, theme: "dark" });
  initCarousel1();
  initCarousel2();
});
