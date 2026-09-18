const API = "http://localhost:8080";

const userId = 1;


// ================================
// LOGIN
// ================================

function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    if (email === "" || password === "") {

        document.getElementById("message")
            .innerText =
            "Please enter email and password.";

        return;
    }


    // For now we use User ID 1.
    // Real authentication will be added later
    // only if needed.

    window.location.href =
        "dashboard.html";
}


// ================================
// LOGOUT
// ================================

function logout() {

    window.location.href =
        "index.html";
}


// ================================
// ADD EXPENSE
// ================================

async function addExpense() {

    const title =
        document.getElementById("expenseTitle").value;

    const amount =
        Number(
            document.getElementById("expenseAmount").value
        );

    const category =
        document.getElementById("expenseCategory").value;

    const expenseDate =
        document.getElementById("expenseDate").value;


    if (!title || !amount || !category || !expenseDate) {

        alert("Please fill all expense fields.");

        return;
    }


    const data = {

        userId: userId,

        title: title,

        amount: amount,

        category: category,

        expenseDate: expenseDate
    };


    try {

        const response =
            await fetch(
                API + "/api/expenses",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        if (response.ok) {

            alert(
                "Expense added successfully!"
            );

            document.getElementById(
                "expenseTitle"
            ).value = "";

            document.getElementById(
                "expenseAmount"
            ).value = "";

            document.getElementById(
                "expenseCategory"
            ).value = "";

            loadDashboard();

        } else {

            alert(
                "Could not add expense."
            );
        }

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to backend."
        );
    }
}


// ================================
// ADD INCOME
// ================================

async function addIncome() {

    const source =
        document.getElementById(
            "incomeSource"
        ).value;

    const amount =
        Number(
            document.getElementById(
                "incomeAmount"
            ).value
        );

    const incomeDate =
        document.getElementById(
            "incomeDate"
        ).value;


    if (!source || !amount || !incomeDate) {

        alert("Please fill all income fields.");

        return;
    }


    const data = {

        userId: userId,

        source: source,

        amount: amount,

        incomeDate: incomeDate
    };


    try {

        const response =
            await fetch(
                API + "/api/income",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        if (response.ok) {

            alert(
                "Income added successfully!"
            );

            document.getElementById(
                "incomeSource"
            ).value = "";

            document.getElementById(
                "incomeAmount"
            ).value = "";

            loadDashboard();

        } else {

            alert(
                "Could not add income."
            );
        }

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to backend."
        );
    }
}


// ================================
// ADD BUDGET
// ================================

async function addBudget() {

    const category =
        document.getElementById(
            "budgetCategory"
        ).value;

    const amount =
        Number(
            document.getElementById(
                "budgetAmount"
            ).value
        );


    if (!category || !amount) {

        alert(
            "Please enter category and amount."
        );

        return;
    }


    const data = {

        userId: userId,

        category: category,

        amount: amount
    };


    try {

        const response =
            await fetch(
                API + "/api/budgets",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );


        if (response.ok) {

            alert(
                "Budget saved successfully!"
            );

            document.getElementById(
                "budgetCategory"
            ).value = "";

            document.getElementById(
                "budgetAmount"
            ).value = "";

        } else {

            alert(
                "Could not save budget."
            );
        }

    } catch (error) {

        console.error(error);

        alert(
            "Cannot connect to backend."
        );
    }
}


// ================================
// LOAD DASHBOARD
// ================================

async function loadDashboard() {

    try {

        // TOTAL EXPENSE

        const expenseResponse =
            await fetch(
                API +
                "/api/analytics/total/" +
                userId
            );

        const expenseData =
            await expenseResponse.json();


        document.getElementById(
            "totalExpense"
        ).innerText =
            "₹" +
            Number(
                expenseData.totalExpense
            ).toFixed(2);


        // HIGHEST EXPENSE

        const highestResponse =
            await fetch(
                API +
                "/api/analytics/highest/" +
                userId
            );

        const highestData =
            await highestResponse.json();


        document.getElementById(
            "highestExpense"
        ).innerText =
            "₹" +
            Number(
                highestData.highestExpense
            ).toFixed(2);


        // INCOME

        const incomeResponse =
            await fetch(
                API +
                "/api/income/user/" +
                userId
            );

        const incomes =
            await incomeResponse.json();


        let totalIncome = 0;


        incomes.forEach(
            function(income) {

                totalIncome +=
                    Number(income.amount);

            }
        );


        document.getElementById(
            "totalIncome"
        ).innerText =
            "₹" +
            totalIncome.toFixed(2);


        // BALANCE

        const totalExpense =
            Number(
                expenseData.totalExpense
            );


        const balance =
            totalIncome -
            totalExpense;


        document.getElementById(
            "balance"
        ).innerText =
            "₹" +
            balance.toFixed(2);


        // CATEGORY ANALYTICS

        const categoryResponse =
            await fetch(
                API +
                "/api/analytics/category/" +
                userId
            );

        const categories =
            await categoryResponse.json();


        const categoryContainer =
            document.getElementById(
                "categoryData"
            );


        categoryContainer.innerHTML = "";


        Object.entries(categories)
            .forEach(
                function([category, amount]) {

                    const item =
                        document.createElement(
                            "div"
                        );

                    item.className =
                        "category-item";

                    item.innerHTML =
                        `<span>${category}</span>
                         <strong>₹${Number(amount).toFixed(2)}</strong>`;

                    categoryContainer
                        .appendChild(item);

                }
            );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }
}


// ================================
// START DASHBOARD
// ================================

if (
    window.location.pathname
        .toLowerCase()
        .includes("dashboard")
) {

    loadDashboard();

}