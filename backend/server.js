const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "RentWise backend is running 🚀"
    });
});

app.post("/api/calculate", (req, res) => {

    const {
        income,
        rent,
        utilities,
        people,
        limit
    } = req.body;

    // Validate input
    if (
        income < 0 ||
        rent < 0 ||
        utilities < 0 ||
        people < 1 ||
        limit < 0
    ) {
        return res.status(400).json({
            error: "Invalid input values"
        });
    }

    // Calculate shares
    const rentShare = rent / people;
    const utilityShare = utilities / people;
    const totalShare = rentShare + utilityShare;

    // Calculate percentage of income
    const incomePercent =
        income > 0
            ? (totalShare / income) * 100
            : 0;

    // Decide affordability
    let status;
    let message;

    if (income === 0) {

        status = "ENTER INCOME";

        message =
            "Enter your monthly income to check affordability.";

    } else if (incomePercent <= limit) {

        status = "AFFORDABLE";

        message =
            "Great choice! This keeps your housing costs comfortably within your budget.";

    } else if (incomePercent <= limit + 10) {

        status = "CONSIDER CAREFULLY";

        message =
            "This is slightly above your comfort limit. Consider reducing expenses or sharing with one more roommate.";

    } else {

        status = "OVER BUDGET";

        message =
            "This cost may put pressure on your monthly budget. Explore a lower-rent option or add a roommate.";
    }

    // Send result to frontend
    res.json({
        rentShare,
        utilityShare,
        totalShare,
        incomePercent,
        remainingIncome: Math.max(0, income - totalShare),
        status,
        message
    });
});

app.listen(PORT, () => {
    console.log(
        `RentWise backend running on http://localhost:${PORT}`
    );
});