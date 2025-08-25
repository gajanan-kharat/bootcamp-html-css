export async function fetchConfig() {
    try {
        const response = await fetch("/api/v1/config");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const { success, data } = await response.json();
        if (!success || !data) throw new Error("Invalid config API response");

        const cfg = {
            ...data,
            fee: data.fee ? (data.fee / 100).toFixed(0) : "0" // paise → rupees
        };
        return cfg;
    } catch (err) {
        console.error("❌ Failed to load /api/v1/config:", err);
        return {
            fee: "99",
            bootcampDate: null,
            offerName: null,
            offerEndDate: null,
        };
    }
}
