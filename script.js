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


// Format numbers as Indian currency
function money(amount) {
    return "₹" + Math.round(amount).toLocaleString("en-IN");
}


// Send data to backend
async function calculate() {

    const income = Math.max(
        0,
        Number(incomeEl.value) || 0
    );

    const rent = Math.max(
        0,
        Number(rentEl.value) || 0
    );

    const utilities = Math.max(
        0,
        Number(utilitiesEl.value) || 0
    );

    const people = Math.max(
        1,
        Number(peopleEl.value) || 1
    );

    const limit = Number(limitEl.value) || 30;


    // Data being sent to backend
    const data = {
        income,
        rent,
        utilities,
        people,
        limit
    };


    try {

        // Call Express backend
        const response = await fetch(
            "http://localhost:3000/api/calculate",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        if (!response.ok) {
            throw new Error("Backend request failed");
        }


        // Get calculation result
        const result = await response.json();


        // Update limit
        limitOutput.textContent =
            limit + "%";

        limitStat.textContent =
            limit + "%";


        // Update main result
        shareEl.textContent =
            money(result.totalShare);

        percentEl.textContent =
            result.incomePercent.toFixed(1) + "%";

        remainingEl.textContent =
            money(result.remainingIncome);


        // Update money breakdown
        rentShareEl.textContent =
            money(result.rentShare);

        utilityShareEl.textContent =
            money(result.utilityShare);

        totalShareEl.textContent =
            money(result.totalShare);


        // Update people badge
        perPersonEl.textContent =
            people +
            (people === 1
                ? " person"
                : " people");


        // Update status
        statusTextEl.textContent =
            result.status;

        messageEl.textContent =
            result.message;


        // Change status color
        if (result.status === "AFFORDABLE") {

            statusEl.style.color =
                "#168b60";

            statusEl.style.background =
                "#e9fbf3";

        } else if (
            result.status === "CONSIDER CAREFULLY"
        ) {

            statusEl.style.color =
                "#bf7400";

            statusEl.style.background =
                "#fff7e7";

        } else {

            statusEl.style.color =
                "#c53b49";

            statusEl.style.background =
                "#fff0f2";
        }


    } catch (error) {

        console.error(
            "Backend error:",
            error
        );

        statusTextEl.textContent =
            "BACKEND OFFLINE";

        messageEl.textContent =
            "Please start the RentWise backend server.";

        statusEl.style.color =
            "#c53b49";

        statusEl.style.background =
            "#fff0f2";
    }
}


// Live calculation
incomeEl.addEventListener(
    "input",
    calculate
);

rentEl.addEventListener(
    "input",
    calculate
);

utilitiesEl.addEventListener(
    "input",
    calculate
);

peopleEl.addEventListener(
    "input",
    calculate
);

limitEl.addEventListener(
    "input",
    calculate
);


// Button
rentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        calculate();
    }
);


// Initial calculation
calculate();