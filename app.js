const STORAGE_KEY = "moneycare_transactions";
const BUDGET_KEY = "moneycare_budget";

const categories = {
  income: ["Lương", "Thưởng", "Đầu tư", "Khác"],
  expense: ["Ăn uống", "Di chuyển", "Học tập", "Hóa đơn", "Giải trí", "Khác"]
};

const sampleTransactions = [
  { id: 1, title: "Lương tháng 5", amount: 8500000, type: "income", category: "Lương", date: "2026-05-01" },
  { id: 2, title: "Tiền ăn trong tuần", amount: 520000, type: "expense", category: "Ăn uống", date: "2026-05-03" },
  { id: 3, title: "Nạp xăng", amount: 90000, type: "expense", category: "Di chuyển", date: "2026-05-05" },
  { id: 4, title: "Mua sách JavaScript", amount: 180000, type: "expense", category: "Học tập", date: "2026-05-06" },
  { id: 5, title: "Thưởng dự án", amount: 1000000, type: "income", category: "Thưởng", date: "2026-05-08" }
];

let transactions = loadTransactions();

const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const messageEl = document.getElementById("formMessage");
const listEl = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const budgetInput = document.getElementById("budgetInput");
const budgetStatus = document.getElementById("budgetStatus");
const chartEl = document.getElementById("categoryChart");
const transactionCount = document.getElementById("transactionCount");
const clearAllBtn = document.getElementById("clearAllBtn");
const seedDataBtn = document.getElementById("seedDataBtn");

function formatCurrency(value) {
  return Number(value).toLocaleString("vi-VN") + " VND";
}

function loadTransactions() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    return JSON.parse(savedData);
  } else {
    return [];
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function updateCategoryOptions() {
  const selectedType = typeInput.value;
  categoryInput.innerHTML = "";

  for (let i = 0; i < categories[selectedType].length; i++) {
    const option = document.createElement("option");
    option.value = categories[selectedType][i];
    option.textContent = categories[selectedType][i];
    categoryInput.appendChild(option);
  }
}

function showMessage(text, isError) {
  messageEl.textContent = text;
  if (isError) {
    messageEl.classList.add("error");
  } else {
    messageEl.classList.remove("error");
  }
}

function createTransactionFromForm() {
  return {
    id: Date.now(),
    title: titleInput.value.trim(),
    amount: Number(amountInput.value),
    type: typeInput.value,
    category: categoryInput.value,
    date: dateInput.value
  };
}

function validateTransaction(transaction) {
  if (transaction.title.length < 3) {
    return "Nội dung cần có ít nhất 3 ký tự.";
  } else if (transaction.amount <= 0) {
    return "Số tiền phải lớn hơn 0.";
  } else if (!transaction.date) {
    return "Vui lòng chọn ngày giao dịch.";
  } else {
    return "";
  }
}

function addTransaction(transaction) {
  transactions.push(transaction);
  saveTransactions();
  renderApp();
}

function deleteTransaction(id) {
  transactions = transactions.filter(function(transaction) {
    return transaction.id !== id;
  });
  saveTransactions();
  renderApp();
}

function calculateTotals(data) {
  let income = 0;
  let expense = 0;

  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "income") {
      income += data[i].amount;
    } else {
      expense += data[i].amount;
    }
  }

  return {
    income: income,
    expense: expense,
    balance: income - expense
  };
}

function filterTransactions() {
  const keyword = searchInput.value.toLowerCase().trim();
  const type = filterType.value;

  return transactions.filter(function(transaction) {
    const matchKeyword = transaction.title.toLowerCase().includes(keyword);
    const matchType = type === "all" || transaction.type === type;

    if (matchKeyword && matchType) {
      return true;
    } else {
      return false;
    }
  });
}

function renderSummary(data) {
  const totals = calculateTotals(data);
  totalIncomeEl.textContent = formatCurrency(totals.income);
  totalExpenseEl.textContent = formatCurrency(totals.expense);
  balanceEl.textContent = formatCurrency(totals.balance);
  updateBudgetStatus(totals.expense);
}

function renderTransactions(data) {
  listEl.innerHTML = "";
  transactionCount.textContent = data.length + " mục";

  if (data.length === 0) {
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");
  }

  for (let i = 0; i < data.length; i++) {
    const item = document.createElement("li");
    item.className = "transaction-item";

    const sign = data[i].type === "income" ? "+" : "-";
    const typeText = data[i].type === "income" ? "Thu nhập" : "Chi tiêu";

    item.innerHTML = `
      <div>
        <div class="transaction-title">${data[i].title}</div>
        <div class="transaction-meta">${typeText} - ${data[i].category} - ${data[i].date}</div>
      </div>
      <div class="transaction-amount ${data[i].type}">${sign}${formatCurrency(data[i].amount)}</div>
      <button class="delete-button" type="button" aria-label="Xóa giao dịch" data-id="${data[i].id}">X</button>
    `;

    listEl.appendChild(item);
  }
}

function getExpenseByCategory(data) {
  const result = {};

  for (let i = 0; i < data.length; i++) {
    if (data[i].type === "expense") {
      if (result[data[i].category]) {
        result[data[i].category] += data[i].amount;
      } else {
        result[data[i].category] = data[i].amount;
      }
    }
  }

  return result;
}

function renderChart(data) {
  chartEl.innerHTML = "";
  const expenseByCategory = getExpenseByCategory(data);
  const values = Object.values(expenseByCategory);
  let maxValue = 0;

  for (let i = 0; i < values.length; i++) {
    if (values[i] > maxValue) {
      maxValue = values[i];
    }
  }

  if (values.length === 0) {
    chartEl.innerHTML = '<p class="empty-state show">Chưa có dữ liệu chi tiêu để vẽ biểu đồ.</p>';
    return;
  }

  for (const category in expenseByCategory) {
    const percent = Math.round((expenseByCategory[category] / maxValue) * 100);
    const row = document.createElement("div");
    row.className = "chart-row";
    row.innerHTML = `
      <div class="chart-label">
        <span>${category}</span>
        <span>${formatCurrency(expenseByCategory[category])}</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${percent}%"></div>
      </div>
    `;
    chartEl.appendChild(row);
  }
}

function updateBudgetStatus(totalExpense) {
  const budget = Number(budgetInput.value);
  localStorage.setItem(BUDGET_KEY, budgetInput.value);
  budgetStatus.className = "budget-status";

  if (budget <= 0) {
    budgetStatus.textContent = "Nhập ngân sách để xem cảnh báo chi tiêu.";
  } else if (totalExpense > budget) {
    budgetStatus.textContent = "Cảnh báo: chi tiêu đã vượt ngân sách " + formatCurrency(totalExpense - budget) + ".";
    budgetStatus.classList.add("warning");
  } else {
    budgetStatus.textContent = "Tốt: bạn còn lại " + formatCurrency(budget - totalExpense) + " trong ngân sách.";
    budgetStatus.classList.add("good");
  }
}

function renderApp() {
  const filteredData = filterTransactions();
  renderSummary(transactions);
  renderTransactions(filteredData);
  renderChart(filteredData);
}

function resetForm() {
  form.reset();
  dateInput.valueAsDate = new Date();
  updateCategoryOptions();
}

form.addEventListener("submit", function(event) {
  event.preventDefault();
  const transaction = createTransactionFromForm();
  const error = validateTransaction(transaction);

  if (error) {
    showMessage(error, true);
  } else {
    addTransaction(transaction);
    showMessage("Đã lưu giao dịch thành công.", false);
    resetForm();
  }
});

typeInput.addEventListener("change", updateCategoryOptions);
searchInput.addEventListener("input", renderApp);
filterType.addEventListener("change", renderApp);
budgetInput.addEventListener("input", renderApp);

listEl.addEventListener("click", function(event) {
  if (event.target.classList.contains("delete-button")) {
    const id = Number(event.target.dataset.id);
    deleteTransaction(id);
  }
});

clearAllBtn.addEventListener("click", function() {
  if (transactions.length === 0) {
    showMessage("Không có dữ liệu để xóa.", true);
  } else if (confirm("Bạn có chắc muốn xóa tất cả giao dịch?")) {
    transactions = [];
    saveTransactions();
    renderApp();
    showMessage("Đã xóa tất cả giao dịch.", false);
  }
});

seedDataBtn.addEventListener("click", function() {
  transactions = sampleTransactions.slice();
  saveTransactions();
  renderApp();
  showMessage("Đã nạp dữ liệu mẫu.", false);
});

budgetInput.value = localStorage.getItem(BUDGET_KEY) || "";
dateInput.valueAsDate = new Date();
updateCategoryOptions();
renderApp();
