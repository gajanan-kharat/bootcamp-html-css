function pad(num) {
    return num.toString().padStart(2, "0");
}

export function startCountdowns(cfg) {
    function updateCountdown(targetDate, ids, liveMode = false) {
        if (!targetDate) return;
        const timer = setInterval(() => {
            const now = Date.now();
            let targetMs = targetDate.getTime();

            if (liveMode) {
                const bootStart9am = new Date(targetDate);
                bootStart9am.setHours(9, 0, 0, 0);
                targetMs = bootStart9am.getTime();
            }

            let distance = targetMs - now;

            if (liveMode && distance <= 0) {
                clearInterval(timer);
                ["days","hours","minutes","seconds"].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = "00";
                });

                const badge = document.getElementById("liveBadge");
                if (badge) badge.style.display = "inline-block";

                const section = document.querySelector(".time-section");
                if (section) section.classList.add("live-mode");
                return;
            }

            if (distance <= 0) {
                clearInterval(timer);
                ids.forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = "00";
                });
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            ids.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (id.includes("days")) el.textContent = pad(days);
                    if (id.includes("hours")) el.textContent = pad(hours);
                    if (id.includes("minutes")) el.textContent = pad(minutes);
                    if (id.includes("seconds")) el.textContent = pad(seconds);
                }
            });
        }, 1000);
    }

    if (cfg.bootcampStartDate) {
        updateCountdown(cfg.bootcampStartDate, ["days", "hours", "minutes", "seconds"], true);
    }

    const offerActive =
        cfg.offerName &&
        cfg.offerEndDate &&
        new Date(cfg.offerEndDate).getTime() > Date.now();

    if (offerActive) {
        document.querySelectorAll(".dynamic-offer-label").forEach((el) => {
            el.textContent = cfg.offerName;
        });
        updateCountdown(new Date(cfg.offerEndDate), ["days1", "hours1", "minutes1", "seconds1"]);
    } else if (cfg.bootcampStartDate) {
        document.querySelectorAll(".dynamic-offer-label").forEach((el) => {
            el.textContent = "Offer";
        });
        updateCountdown(cfg.bootcampStartDate, ["days1", "hours1", "minutes1", "seconds1"]);
    }
}
