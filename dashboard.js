import { state, formatAmount } from "./data.js";

let barChart = null;
let donutChart = null;

export function renderDashboard() {
  let balance = state.totalIncome - state.totalExpenses;

  document.getElementById("incomeDisplay").innerText = formatAmount(
    state.totalIncome
  );
  document.getElementById("expenseDisplay").innerText = formatAmount(
    state.totalExpenses
  );
  document.getElementById("balanceDisplay").innerText =
    formatAmount(balance);

  if (balance < 0) {
    document.getElementById("balanceDisplay").style.color = "red";
  } else {
    document.getElementById("balanceDisplay").style.color = "green";
  }

  renderBarChart();
  renderDonutChart();
}

function renderBarChart() {
  // Guard — nothing to draw
  if (state.entries.length === 0) {
    if (barChart !== null) {
      barChart.destroy();
      barChart = null;
    }
    return;
  }

  let canvas = document.getElementById("barChart");
  let ctx = canvas.getContext("2d");

  if (barChart !== null) {
    barChart.destroy();
  }

  barChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Amount (₦)",
          data: [state.totalIncome, state.totalExpenses],
          backgroundColor: ["#22c55e", "#ef4444"],
          borderRadius: 8,
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let value = context.parsed.y; // Correct for Cartesian/bar charts
              return " " + formatAmount(value);
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "#71717a",
          },
          grid: {
            color: "#27272a",
          },
        },
        x: {
          ticks: {
            color: "#71717a",
          },
          grid: {
            display: false,
          },
        },
      },
    },
  });
}

function renderDonutChart() {
  // Guard — nothing to draw
  if (state.entries.length === 0) {
    if (donutChart !== null) {
      donutChart.destroy();
      donutChart = null;
    }
    return;
  }

  let canvas = document.getElementById("donutChart");
  let ctx = canvas.getContext("2d");

  if (donutChart !== null) {
    donutChart.destroy();
  }

  donutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          data: [state.totalIncome, state.totalExpenses],
          backgroundColor: ["#22c55e", "#ef4444"],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let value = context.parsed;
              return " " + formatAmount(value);
            },
          },
        },
      },
    },
  });
}
