let entries = [];
let savedData = localStorage.getItem("entries");

try {
  if (savedData) {
    entries = JSON.parse(savedData);
    if (!Array.isArray(entries)) {
      entries = [];
    }
  }
  // Remove corrupted entries
  entries = entries.filter(function (entry) {
    return (
      typeof entry.description === "string" &&
      typeof entry.amount === "number" &&
      typeof entry.type === "string" &&
      typeof entry.date === "string"
    );
  });
} catch (error) {
  console.error("Error parsing saved data:", error);
  entries = [];
}

// Migrate old entries that have no ID
entries = entries.map(function(entry) {
    if (!entry.id) {
        entry.id = crypto.randomUUID();
    }
    return entry;
});
if (entries.length > 0) {
    localStorage.setItem("entries", JSON.stringify(entries));
}


let totalIncome = 0;
let totalExpenses = 0;
let sortOrder = "newest";

let descriptionInput = document.getElementById("descriptionInput");
let amountInput = document.getElementById("amountInput");
let typeSelect = document.getElementById("typeSelect");
let addButton = document.getElementById("addButton");
let clearButton = document.getElementById("clearButton");
let incomeDisplay = document.getElementById("incomeDisplay");
let expenseDisplay = document.getElementById("expenseDisplay");
let balanceDisplay = document.getElementById("balanceDisplay");
let entriesList = document.getElementById("entriesList");
let dateInput = document.getElementById("dateInput");

function addEntry() {
  let description = descriptionInput.value.trim();
  let amount = Number(amountInput.value);
  let type = typeSelect.value;
  let date = dateInput.value;

  if (!description || isNaN(amount) || amount <= 0 || !date) {
    alert(
      "Invalid input. Please enter a description, a valid amount, and a date.",
    );
    return;
  }

  let entry = { id: crypto.randomUUID(), description, amount, type, date };
  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));
  // save to localStorage

  descriptionInput.value = "";
  amountInput.value = "";
  typeSelect.value = "income";
  dateInput.value = "";

  updateSummary();
  displayEntries();
}

function updateSummary() {
  totalIncome = entries
    .filter(function (entry) {
      return entry.type === "income";
    })
    .reduce(function (sum, entry) {
      return sum + entry.amount;
    }, 0);

  totalExpenses = entries
    .filter(function (entry) {
      return entry.type === "expense";
    })
    .reduce(function (sum, entry) {
      return sum + entry.amount;
    }, 0);

  let balance = totalIncome - totalExpenses;

  incomeDisplay.innerText = `₦${totalIncome}`;
  expenseDisplay.innerText = `₦${totalExpenses}`;
  balanceDisplay.innerText = `₦${balance}`;

  if (balance < 0) {
    balanceDisplay.style.color = "red";
  } else {
    balanceDisplay.style.color = "green";
  }
  displayCategoryTable();
}

function displayEntries() {
  entriesList.innerHTML = "";
  let sorted = getSortedEntries();
  for (let i = 0; i < sorted.length; i++) {
    let entry = sorted[i];

    let listItem = document.createElement("li");

    // Date
    let dateSpan = document.createElement("span");
    dateSpan.innerText = entry.date;
    dateSpan.classList.add("entry-date");

    // Description
    let descriptionSpan = document.createElement("span");
    descriptionSpan.innerText = entry.description;
    descriptionSpan.classList.add("entry-description");

    // Amount
    let amountSpan = document.createElement("span");
    amountSpan.innerText = `₦${entry.amount}`;

    if (entry.type === "income") {
      amountSpan.classList.add("income");
    } else {
      amountSpan.classList.add("expense");
    }

    // Type Badge
    let typeSpan = document.createElement("span");
    typeSpan.innerText = entry.type;
    typeSpan.classList.add("entry-type");

    const capturedId = entry.id
    // Edit Button
    let editButton = document.createElement("button");
    editButton.innerText = "Edit";

    editButton.addEventListener("click", function () {
      editEntry(capturedId)
    });

    // Delete Button
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";

    deleteButton.addEventListener("click", function () {
      deleteEntry(capturedId) 
    });

    // Add everything to the list item
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

    entriesList.appendChild(listItem);
  }
}

function editEntry(id) {
  let index = entries.findIndex(function (entry) {
    return entry.id === id;
  });

  if (index === -1) {
    return; // entry not found — do nothing
  }

  let entry = entries[index];

  // ── Description ──
  let newDescription = prompt("Description:", entry.description);
  if (newDescription === null) {
    return; // user cancelled, stop everything, don't save
  }

  // ── Amount ──
  let newAmountStr = prompt("Amount:", entry.amount);
  if (newAmountStr === null) {
    return; // user cancelled
  }

  let newAmount = Number(newAmountStr);
  if (isNaN(newAmount) || newAmount <= 0) {
    alert("Invalid amount. Edit cancelled.");
    return;
  }

  // ── Type ──
  let newType = prompt("Type (income or expense):", entry.type);
  if (newType === null) {
    return; // user cancelled
  }

  newType = newType.trim().toLowerCase();
  if (newType !== "income" && newType !== "expense") {
    alert("Type must be 'income' or 'expense'. Edit cancelled.");
    return;
  }

  // ── Date ──
  let newDate = prompt("Date (YYYY-MM-DD):", entry.date);
  if (newDate === null) {
    return; // user cancelled
  }

  if (newDate === "") {
    alert("Date cannot be empty. Edit cancelled.");
    return;
  }

  // ── All fields valid — update the entry ──
  entries[index].description = newDescription.trim();
  entries[index].amount = newAmount;
  entries[index].type = newType;
  entries[index].date = newDate;

  // ── Save and re-render ──
  localStorage.setItem("entries", JSON.stringify(entries));
  displayEntries();
  updateSummary();
}

function deleteEntry(id){
  // find the real position in the original entries array
    let index = entries.findIndex(function(entry){
        return entry.id === id
    })

    if (index === -1) {
        return   // entry not found — do nothing
    }

    entries.splice(index, 1)
    localStorage.setItem("entries", JSON.stringify(entries))
    updateSummary()
    displayEntries()
}

  

function clearAll() {
  entries = [];
  localStorage.removeItem("entries");
  entriesList.innerHTML = "";
  updateSummary();
  displayEntries();
}

// for calculating category totals, we create a function getCategoryTotals() that uses the reduce() method
// to iterate through all entries and accumulate the total amounts for each category (income and expense) into an object.
// This object will have keys corresponding to each category and values representing the total amounts,
// which we can then use for display purposes.

function getCategoryTotals() {
  let totals = entries.reduce(function (acc, entry) {
    acc[entry.type] = (acc[entry.type] || 0) + entry.amount;
    return acc;
  }, {});
  return totals;
}

//for displaying the category totals in a table format, we create a function displayCategoryTable()
// that retrieves the totals using getCategoryTotals(), then dynamically creates and appends HTML elements
//  to show each category and its total amount on the webpage. We also apply conditional styling to differentiate
//  between income and expenses visually.

function displayCategoryTable() {
  // 1. Get the final totals object we built with reduce()
  let totals = getCategoryTotals(); // e.g., { income: 230000, expense: 62000 }

  // 2. Grab the HTML element where the list should live, and clear it out
  let categoryList = document.getElementById("categoryList");
  categoryList.innerHTML = "";

  // 3. Object.keys() gives us: ["income", "expense"]
  // Object.keys() gives you an array of the keys: ["income", "expense"]
  let types = Object.keys(totals).sort(function (a, b) {
    return totals[b] - totals[a];
  });

  // 4. Loop through each type using a standard JavaScript for...of loop
  for (let type of types) {
    // Create the main row container (a list item)
    let row = document.createElement("li");
    row.classList.add("category-row"); // optional: for CSS styling later

    // Create the label span (e.g., "Income")
    let labelSpan = document.createElement("span");
    // Capitalize the first letter, then add the rest of the word
    labelSpan.textContent = type.charAt(0).toUpperCase() + type.slice(1);

    // Create the amount span (e.g., "₦230,000")
    let amountSpan = document.createElement("span");
    amountSpan.textContent = "₦" + totals[type].toLocaleString(); // toLocaleString adds nice commas

    // Apply colors conditionally based on the type
    if (type === "income") {
      amountSpan.style.color = "green";
    } else if (type === "expense") {
      amountSpan.style.color = "red";
    }

    // 5. Append both spans to the row
    row.appendChild(labelSpan);
    row.appendChild(amountSpan);

    // 6. Append the finished row to the main list on your webpage
    categoryList.appendChild(row);
  }
}

// for sorting entries by date, we create a function that returns a sorted copy of the entries array based on the current sortOrder.
// This way, we don't mutate the original entries array and can easily switch between sorting orders when the user clicks the sort button.
// Let's assume you have a global variable or state tracking the order
function getSortedEntries() {
  // Make a clone of the original entries array
  let sorted = entries.slice(); // slice() with no args copies the whole array
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

//for sortOrder toggle button, we add an event listener to the button that toggles the sortOrder
// variable between "newest" and "oldest" each time it's clicked. After updating the sortOrder,
//  we call displayEntries() to re-render the list with the new sorting applied.

let sortButton = document.getElementById("sortButton");

sortButton.addEventListener("click", function () {
  if (sortOrder === "newest") {
    sortOrder = "oldest";
    sortButton.innerText = "Oldest first";
  } else {
    sortOrder = "newest";
    sortButton.innerText = "Newest first";
  }
  displayEntries(); // re-render with new sort order
});

addButton.addEventListener("click", addEntry);
clearButton.addEventListener("click", clearAll);

// show saved data on page load
updateSummary();
displayEntries();
