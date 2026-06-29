export const state = {
    entries: [],
    totalIncome: 0,
    totalExpenses: 0
}


let savedData = localStorage.getItem("entries")
try {
    if (savedData) {
        let parsed = JSON.parse(savedData)
        if (Array.isArray(parsed)) {
            state.entries = parsed.filter(function(entry) {
                return typeof entry.description === "string"
                    && typeof entry.amount === "number"
                    && typeof entry.type === "string"
                    && typeof entry.date === "string"
            })
        }
    }
} catch(e) {
    console.error("Could not load saved data:", e)
    state.entries = []
}


state.entries = state.entries.map(function(entry) {
    if (!entry.id) entry.id = crypto.randomUUID()
    return entry
})
if (state.entries.length > 0) {
    localStorage.setItem("entries", JSON.stringify(state.entries))
}


export function formatAmount(amount) {
    return "₦" + amount.toLocaleString("en-NG")
}


export function formatDate(dateString) {
    let date = new Date(dateString + "T00:00:00")
    return date.toLocaleDateString("en-NG", {
        day: "numeric", month: "short", year: "numeric"
    })
}


export function updateSummary() {
    state.totalIncome = state.entries
        .filter(e => e.type === "income")
        .reduce((sum, e) => sum + e.amount, 0)
    state.totalExpenses = state.entries
        .filter(e => e.type === "expense")
        .reduce((sum, e) => sum + e.amount, 0)

}

