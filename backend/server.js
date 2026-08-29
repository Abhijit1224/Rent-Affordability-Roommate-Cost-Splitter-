const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "RentWise backend is running 🚀"
    });
});

// Affordability API
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
            "This is slightly above your comfort limit.";

    } else {
        status = "OVER BUDGET";
        message =
            "This cost may put pressure on your monthly budget.";
    }

    // Send result back to frontend
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

// Start server
app.listen(PORT, "0.0.0.0", () => {

    console.log(`RentWise backend running on port ${PORT}`);

});