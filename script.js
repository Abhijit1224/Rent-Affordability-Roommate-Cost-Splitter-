const incomeEl = document.getElementById("income");
const rentEl = document.getElementById("rent");
const utilitiesEl = document.getElementById("utilities");
const peopleEl = document.getElementById("people");
const limitEl = document.getElementById("limit");

const shareEl = document.getElementById("share");
const percentEl = document.getElementById("percent");
const remainingEl = document.getElementById("remaining");
const limitOutput = document.getElementById("limit-output");
const limitStat = document.getElementById("limit-stat");

const rentShareEl = document.getElementById("rent-share");
const utilityShareEl = document.getElementById("utility-share");
const totalShareEl = document.getElementById("total-share");
const perPersonEl = document.getElementById("per-person");

const statusEl = document.getElementById("status");
const statusTextEl = document.getElementById("status-text");
const messageEl = document.getElementById("message");

const rentForm = document.getElementById("rent-form");

function money(amount) {
    return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function calculate() {
    const income = Math.max(0, Number(incomeEl.value) || 0);
    const rent = Math.max(0, Number(rentEl.value) || 0);
    const utilities = Math.max(0, Number(utilitiesEl.value) || 0);
    const people = Math.max(1, Number(peopleEl.value) || 1);
    const limit = Number(limitEl.value) || 30;

    // Calculate each person's share
    const rentShare = rent / people;
    const utilityShare = utilities / people;
    const totalShare = rentShare + utilityShare;

    // Calculate percentage of income
    const incomePercent = income > 0
        ? (totalShare / income) * 100
        : 0;

    // Update limit
    limitOutput.textContent = limit + "%";
    limitStat.textContent = limit + "%";

    // Update main result
    shareEl.textContent = money(totalShare);
    percentEl.textContent = incomePercent.toFixed(1) + "%";
    remainingEl.textContent = money(
        Math.max(0, income - totalShare)
    );

    // Update money breakdown
    rentShareEl.textContent = money(rentShare);
    utilityShareEl.textContent = money(utilityShare);
    totalShareEl.textContent = money(totalShare);

    // Update people badge
    perPersonEl.textContent =
        people + (people === 1 ? " person" : " people");

    // Decide affordability status
    let status;
    let message;
    let color;
    let background;

    if (income === 0) {
        status = "ENTER INCOME";
        message = "Enter your monthly income to check affordability.";
        color = "#667085";
        background = "#f1f3f6";

    } else if (incomePercent <= limit) {
        status = "AFFORDABLE";
        message =
            "Great choice! This keeps your housing costs comfortably within your budget.";
        color = "#168b60";
        background = "#e9fbf3";

    } else if (incomePercent <= limit + 10) {
        status = "CONSIDER CAREFULLY";
        message =
            "This is slightly above your comfort limit. Consider reducing expenses or sharing with one more roommate.";
        color = "#bf7400";
        background = "#fff7e7";

    } else {
        status = "OVER BUDGET";
        message =
            "This cost may put pressure on your monthly budget. Explore a lower-rent option or add a roommate.";
        color = "#c53b49";
        background = "#fff0f2";
    }

    // Update status UI
    statusTextEl.textContent = status;
    messageEl.textContent = message;
    statusEl.style.color = color;
    statusEl.style.background = background;
}

// Live calculation whenever input changes
incomeEl.addEventListener("input", calculate);
rentEl.addEventListener("input", calculate);
utilitiesEl.addEventListener("input", calculate);
peopleEl.addEventListener("input", calculate);
limitEl.addEventListener("input", calculate);

// Button
rentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    calculate();
});

// Initial calculation
calculate();