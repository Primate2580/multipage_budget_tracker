import { updateSummary } from "./data.js";
import { renderDashboard } from "./dashboard.js";
import {
  addEntry,
  clearAll,
  displayEntries,
  setFromDate,
  setToDate,
  toggleSortOrder,
  setSearchKeyword,
  setFilterType,
} from "./transactions.js";
import { displayCategoryTable, displayMonthlyTable } from "./reports.js";
import { showPage } from "./router.js";


let debounceTimer = null

export function refreshAll() {
  updateSummary();
  renderDashboard();
  displayCategoryTable();
  displayMonthlyTable();
  displayEntries();
}

// Wire up buttons
document.getElementById("addButton").addEventListener("click", addEntry);

document.getElementById("clearButton").addEventListener("click", clearAll);
document
  .getElementById("sortButton")
  .addEventListener("click", toggleSortOrder);

document.getElementById("searchInput").addEventListener("input", function() {
    let value = this.value       // capture value NOW, before setTimeout runs

    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(function() {
        setSearchKeyword(value)
        displayEntries()
    }, 300)
})

document.getElementById("filterSelect").addEventListener("change", function () {
  setFilterType(this.value);
  displayEntries();
});
document.getElementById("fromDateInput").addEventListener("input", function () {
  setFromDate(this.value);
  displayEntries();
});

document.getElementById("toDateInput").addEventListener("input", function () {
  setToDate(this.value);
  displayEntries();
});

// Listen for data changes from transactions.js
window.addEventListener("dataChanged", refreshAll);

// Boot
refreshAll();
window.addEventListener("hashchange", showPage);
showPage();
