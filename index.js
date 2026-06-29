import { updateSummary } from './data.js'
import { renderDashboard } from './dashboard.js'
import { addEntry, clearAll, displayEntries, toggleSortOrder } from './transactions.js'
import { displayCategoryTable } from './reports.js'
import { showPage } from './router.js'

export function refreshAll() {
    updateSummary()
    renderDashboard()
    displayCategoryTable()
    displayEntries()
}

// Wire up buttons
document.getElementById("addButton").addEventListener("click", addEntry)
document.getElementById("clearButton").addEventListener("click", clearAll)
document.getElementById("sortButton").addEventListener("click", toggleSortOrder)

// Listen for data changes from transactions.js
window.addEventListener("dataChanged", refreshAll)

// Boot
refreshAll()
window.addEventListener("hashchange", showPage)
showPage()