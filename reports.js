import { state, formatAmount } from "./data.js";

export function getCategoryTotals() {
  let totals = state.entries.reduce(function (acc, entry) {
    acc[entry.type] = (acc[entry.type] || 0) + entry.amount;
    return acc;
  }, {});
  return totals;
}
export function displayCategoryTable() {
  let totals = getCategoryTotals();

  let categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  let types = Object.keys(totals).sort(function (a, b) {
    return totals[b] - totals[a];
  });

  for (let type of types) {
    let row = document.createElement("li");
    row.classList.add("category-row");

    let labelSpan = document.createElement("span");

    labelSpan.textContent = type.charAt(0).toUpperCase() + type.slice(1);

    let amountSpan = document.createElement("span");
    amountSpan.textContent = formatAmount(totals[type]);

    amountSpan.classList.add("font-semibold", "text-sm");
    if (type === "income") {
      amountSpan.classList.add("text-emerald-400");
    } else {
      amountSpan.classList.add("text-red-400");
    }

    // The row — flex layout, space between label and amount:
    row.classList.add(
      "flex",
      "justify-between",
      "items-center",
      "py-2",
      "border-b",
      "border-zinc-800",
    );

    // The label span:
    labelSpan.classList.add("text-zinc-300", "text-sm");

    row.appendChild(labelSpan);
    row.appendChild(amountSpan);

    categoryList.appendChild(row);
  }
}


export function getMonthlyTotals() {
  return state.entries.reduce(function (acc, entry) {
    let month = entry.date.slice(0, 7); // e.g. "2025-06"

    if (!acc[month]) {
      acc[month] = {
        income: 0,
        expenses: 0,
      };
    }

    if (entry.type === "income") {
      acc[month].income += entry.amount;
    } else {
      acc[month].expenses += entry.amount;
    }

    return acc;
  }, {});
}

export function displayMonthlyTable() {
  let monthly = getMonthlyTotals();

  let monthlyList = document.getElementById("monthlyList");
  monthlyList.innerHTML = "";

  // Handle empty state
  if (state.entries.length === 0) {
    let emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No entries yet";
    emptyMessage.classList.add(
      "text-zinc-500",
      "text-center",
      "py-4",
      "text-sm"
    );

    monthlyList.appendChild(emptyMessage);
    return;
  }

  // Sort months newest first
  let sortedMonths = Object.keys(monthly).sort(function (a, b) {
    return b.localeCompare(a);
  });

  for (let month of sortedMonths) {
    let data = monthly[month];
    let net = data.income - data.expenses;

    let row = document.createElement("li");
    row.classList.add(
      "flex",
      "justify-between",
      "items-center",
      "py-3",
      "border-b",
      "border-zinc-800"
    );

    // Month label
    let labelSpan = document.createElement("span");
    labelSpan.textContent = formatMonthLabel(month);
    labelSpan.classList.add(
      "text-zinc-300",
      "text-sm",
      "font-medium"
    );

    // Right side
    let rightDiv = document.createElement("div");
    rightDiv.classList.add("flex", "gap-4");

    // Income
    let incomeSpan = document.createElement("span");
    incomeSpan.textContent = formatAmount(data.income);
    incomeSpan.classList.add("text-emerald-400", "text-sm");

    // Expenses
    let expenseSpan = document.createElement("span");
    expenseSpan.textContent = formatAmount(data.expenses);
    expenseSpan.classList.add("text-red-400", "text-sm");

    // Net
    let netSpan = document.createElement("span");
    netSpan.textContent = formatAmount(net);
    netSpan.classList.add("text-sm", "font-semibold");

    if (net >= 0) {
      netSpan.classList.add("text-emerald-400");
    } else {
      netSpan.classList.add("text-red-400");
    }

    rightDiv.appendChild(incomeSpan);
    rightDiv.appendChild(expenseSpan);
    rightDiv.appendChild(netSpan);

    row.appendChild(labelSpan);
    row.appendChild(rightDiv);

    monthlyList.appendChild(row);
  }
}

function formatMonthLabel(yearMonth){
    let date = new Date(yearMonth + "-01T00:00:00")
    return date.toLocaleDateString("en-NG", {
        month: "long",
        year: "numeric"
    })
  }