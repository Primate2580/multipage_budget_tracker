import { state, formatAmount, formatDate } from "./data.js";

let sortOrder = "newest";

export function addEntry() {
  let description = document
    .getElementById("descriptionInput")
    .value.trim();
  let amount = Number(document.getElementById("amountInput").value);
  let type = document.getElementById("typeSelect").value;
  let date = document.getElementById("dateInput").value;

  if (!description || isNaN(amount) || amount <= 0 || !date) {
    alert(
      "Invalid input. Please enter a description, a valid amount, and a date."
    );
    return;
  }

  let entry = { id: crypto.randomUUID(), description, amount, type, date };

  state.entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(state.entries));

  document.getElementById("descriptionInput").value = "";
  document.getElementById("amountInput").value = "";
  document.getElementById("typeSelect").value = "income";
  document.getElementById("dateInput").value = "";

  window.dispatchEvent(new CustomEvent("dataChanged"));
}

export function displayEntries() {
  document.getElementById("entriesList").innerHTML = "";

  let sorted = getSortedEntries();

  for (let i = 0; i < sorted.length; i++) {
    let entry = sorted[i];

    let listItem = document.createElement("li");

    // Date
    let dateSpan = document.createElement("span");
    dateSpan.innerText = formatDate(entry.date);
    dateSpan.classList.add("entry-date");

    // Description
    let descriptionSpan = document.createElement("span");
    descriptionSpan.innerText = entry.description;
    descriptionSpan.classList.add("entry-description");

    // Amount
    let amountSpan = document.createElement("span");
    amountSpan.innerText = formatAmount(entry.amount);

    if (entry.type === "income") {
      amountSpan.classList.add("income");
    } else {
      amountSpan.classList.add("expense");
    }

    // Type Badge
    let typeSpan = document.createElement("span");
    typeSpan.innerText = entry.type;
    typeSpan.classList.add("entry-type");

    const capturedId = entry.id;

    // Edit Button
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";

    editButton.addEventListener("click", function () {
      editEntry(capturedId);
    });

    // Delete Button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteEntry(capturedId);
    });

    listItem.appendChild(dateSpan);
    listItem.appendChild(document.createTextNode(" | "));
    listItem.appendChild(descriptionSpan);
    listItem.appendChild(document.createTextNode(" - "));
    listItem.appendChild(amountSpan);
    listItem.appendChild(document.createTextNode(" "));
    listItem.appendChild(typeSpan);
    listItem.appendChild(document.createTextNode(" "));
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    document.getElementById("entriesList").appendChild(listItem);
  }
}

export function editEntry(id) {
  let index = state.entries.findIndex(function (entry) {
    return entry.id === id;
  });

  if (index === -1) {
    return;
  }

  let entry = state.entries[index];

  let newDescription = prompt("Description:", entry.description);
  if (newDescription === null) {
    return;
  }

  let newAmountStr = prompt("Amount:", entry.amount);
  if (newAmountStr === null) {
    return;
  }

  let newAmount = Number(newAmountStr);

  if (isNaN(newAmount) || newAmount <= 0) {
    alert("Invalid amount. Edit cancelled.");
    return;
  }

  let newType = prompt("Type (income or expense):", entry.type);
  if (newType === null) {
    return;
  }

  newType = newType.trim().toLowerCase();

  if (newType !== "income" && newType !== "expense") {
    alert("Type must be 'income' or 'expense'. Edit cancelled.");
    return;
  }

  let newDate = prompt("Date (YYYY-MM-DD):", entry.date);
  if (newDate === null) {
    return;
  }

  if (newDate === "") {
    alert("Date cannot be empty. Edit cancelled.");
    return;
  }

  state.entries[index].description = newDescription.trim();
  state.entries[index].amount = newAmount;
  state.entries[index].type = newType;
  state.entries[index].date = newDate;

  localStorage.setItem("entries", JSON.stringify(state.entries));
  window.dispatchEvent(new CustomEvent("dataChanged"));
}

export function deleteEntry(id) {
  let index = state.entries.findIndex(function (entry) {
    return entry.id === id;
  });

  if (index === -1) {
    return;
  }

  state.entries.splice(index, 1);
  localStorage.setItem("entries", JSON.stringify(state.entries));
  window.dispatchEvent(new CustomEvent("dataChanged"));
}

export function clearAll() {
  state.entries = [];
  localStorage.removeItem("entries");
  document.getElementById("entriesList").innerHTML = "";
  window.dispatchEvent(new CustomEvent("dataChanged"));
}

export function getSortedEntries() {
  let sorted = state.entries.slice();

  if (sortOrder === "newest") {
    sorted.sort(function (a, b) {
      return b.date.localeCompare(a.date);
    });
  } else {
    sorted.sort(function (a, b) {
      return a.date.localeCompare(b.date);
    });
  }

  return sorted;
}

// Add to transactions.js:
export function toggleSortOrder() {
    if (sortOrder === "newest") {
        sortOrder = "oldest"
        document.getElementById("sortButton").innerText = "Oldest first"
    } else {
        sortOrder = "newest"
        document.getElementById("sortButton").innerText = "Newest first"
    }
    displayEntries()
}