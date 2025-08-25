export function bindConfigToUI(cfg) {
    document.querySelectorAll(".dynamic-price").forEach((el) => {
        el.textContent = `₹ ${cfg.fee}/-`;
    });

    if (cfg.bootcampDuration && cfg.bootcampStartPretty) {
        document.querySelectorAll(".dynamic-bootcamp-days").forEach((el) => {
            el.textContent = cfg.bootcampDuration;
        });
        document.querySelectorAll(".dynamic-bootcamp-start").forEach((el) => {
            el.textContent = cfg.bootcampStartPretty;
        });
    } else {
        document.querySelectorAll(".dynamic-bootcamp-days").forEach((el) => {
            el.textContent = "N";
        });
    }
}
