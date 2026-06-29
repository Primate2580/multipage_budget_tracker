import { state, formatAmount } from './data.js'


export function getCategoryTotals() {
  let totals = state.reduce(function (acc, entry) {
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
