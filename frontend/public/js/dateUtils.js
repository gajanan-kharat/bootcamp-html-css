export function parseEventDate(dateRange) {
    try {
        const [startStr, endStr] = dateRange.split("TO").map(s => s.trim());
        const [sd, sm, sy] = startStr.split("/").map(Number);
        const [ed, em, ey] = endStr.split("/").map(Number);

        const startDateObj = new Date(sy, sm - 1, sd, 9, 0, 0, 0);
        const endDateObj = new Date(ey, em - 1, ed, 23, 59, 59, 999);

        const diffTime = endDateObj.getTime() - startDateObj.getTime();
        const duration = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);

        const day = startDateObj.getDate();
        const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(startDateObj);

        const suffix = (d) => {
            if (d % 10 === 1 && d !== 11) return d + "st";
            if (d % 10 === 2 && d !== 12) return d + "nd";
            if (d % 10 === 3 && d !== 13) return d + "rd";
            return d + "th";
        };
        const startPretty = `${suffix(day)} ${month}`;

        return { startDateObj, endDateObj, duration, startPretty };
    } catch (e) {
        console.warn("⚠️ EVENT_DATE parse failed:", e);
        return { startDateObj: null, endDateObj: null, duration: "N", startPretty: "" };
    }
}
