import { updateSummary } from './data.js'
import { renderDashboard } from './dashboard.js'
import { addEntry, clearAll, displayEntries, toggleSortOrder, setSearchKeyword } from './transactions.js'
import { displayCategoryTable, displayMonthlyTable } from './reports.js'
import { showPage } from './router.js'

export function refreshAll() {
    updateSummary()
    renderDashboard()
    displayCategoryTable()
    displayMonthlyTable()
    displayEntries()
}

// Wire up buttons
document.getElementById("addButton").addEventListener("click", addEntry)
document.getElementById("clearButton").addEventListener("click", clearAll)
document.getElementById("sortButton").addEventListener("click", toggleSortOrder)
document.getElementById("searchInput").addEventListener("input", function() {
setSearchKeyword(this.value)
displayEntries()
})

// Listen for data changes from transactions.js
window.addEventListener("dataChanged", refreshAll)

// Boot
refreshAll()
window.addEventListener("hashchange", showPage)
showPage()