const descInput = document.getElementById("desc");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("add-transaction");
const transactionsList = document.getElementById("transactions");
const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const balanceEl = document.getElementById("balance");
const themeToggle = document.getElementById("theme-toggle");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateSummary() {
  let income = 0, expenses = 0;
  transactions.forEach(t => {
    if (t.type === "income") income += t.amount;
    else expenses += t.amount;
  });
  totalIncomeEl.textContent = `₹${income}`;
  totalExpensesEl.textContent = `₹${expenses}`;
  balanceEl.textContent = `₹${income - expenses}`;
}

function renderTransactions() {
  transactionsList.innerHTML = "";
  transactions.forEach((t, index) => {
    const li = document.createElement("li");
    li.textContent = `${t.desc} - ₹${t.amount} (${t.category})`;
    li.style.color = t.type === "income" ? "green" : "red";
    li.onclick = () => {
      transactions.splice(index, 1);
      saveAndRender();
    };
    transactionsList.appendChild(li);
  });
}

function saveAndRender() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateSummary();
  renderTransactions();
  renderChart();
}

addBtn.addEventListener("click", () => {
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);
  if (!desc || isNaN(amount)) return alert("Please enter valid data");
  
  transactions.push({
    desc,
    amount,
    type: typeInput.value,
    category: categoryInput.value
  });

  descInput.value = "";
  amountInput.value = "";
  saveAndRender();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

function renderChart() {
  const categories = {};
  transactions.forEach(t => {
    if (t.type === "expense") {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });

  const ctx = document.getElementById("categoryChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categories),
      datasets: [{
        data: Object.values(categories),
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4caf50", "#9c27b0"]
      }]
    }
  });
}

saveAndRender();