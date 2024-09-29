// app.js

// Function to toggle password visibility
function togglePasswordVisibility(passwordInput, checkbox) {
    passwordInput.type = checkbox.checked ? 'text' : 'password';
}

// ---------- Login Functionality ----------

// Event listener for login form password visibility
const showPasswordCheckbox = document.getElementById('show-password');
if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', function () {
        const passwordInput = document.getElementById('password');
        if (passwordInput) {
            togglePasswordVisibility(passwordInput, this);
        }
    });
}

// Event listener for login button
const loginButton = document.getElementById('login-button');
if (loginButton) {
    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            document.getElementById('message').innerText = "Please enter both username and password.";
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById('message').innerText = "Login successful!";
                // Store the token
                localStorage.setItem('token', result.token);
                // Redirect to home or dashboard
                window.location.href = 'index.html';
            } else {
                document.getElementById('message').innerText = result.message || "Login failed!";
            }
        } catch (error) {
            console.error('Error during login:', error);
            document.getElementById('message').innerText = "An error occurred. Please try again later.";
        }
    });
}

// ---------- Registration Functionality ----------

// Event listener for register form password visibility
const showRegPasswordCheckbox = document.getElementById('show-reg-password');
if (showRegPasswordCheckbox) {
    showRegPasswordCheckbox.addEventListener('change', function () {
        const regPasswordInput = document.getElementById('reg-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        if (regPasswordInput) {
            togglePasswordVisibility(regPasswordInput, this);
        }
        if (confirmPasswordInput) {
            togglePasswordVisibility(confirmPasswordInput, this);
        }
    });
}

// Event listener for register button
const registerButton = document.getElementById('register-button');
if (registerButton) {
    registerButton.addEventListener('click', async () => {
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (!username || !email || !password || !confirmPassword) {
            document.getElementById('message').innerText = "Please fill in all fields.";
            return;
        }

        if (password !== confirmPassword) {
            document.getElementById('message').innerText = "Passwords do not match!";
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById('message').innerText = "Registration successful! You can now log in.";
                // Optionally, redirect to login page
                // window.location.href = 'login.html';
            } else {
                document.getElementById('message').innerText = result.message || "Registration failed!";
            }
        } catch (error) {
            console.error('Error during registration:', error);
            document.getElementById('message').innerText = "An error occurred. Please try again later.";
        }
    });
}

// ---------- Add Expense Functionality ----------

const addExpenseForm = document.querySelector('form#app'); // Assuming only one form with id 'app' per page

if (addExpenseForm && document.title.includes('Add Expense')) {
    addExpenseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value.trim();

        if (!date || !category || isNaN(amount) || !description) {
            alert("Please fill in all fields correctly.");
            return;
        }

        try {
            // Assuming the user is authenticated and a token is stored in localStorage
            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:5000/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ date, category, amount, description }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Expense added successfully!");
                addExpenseForm.reset();
            } else {
                alert(result.message || "Failed to add expense.");
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            alert("An error occurred. Please try again later.");
        }
    });
}

// ---------- View Expenses Functionality ----------

if (document.title.includes('View Expenses')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/expenses', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const expenses = await response.json();

            if (response.ok) {
                populateExpensesTable(expenses);
            } else {
                alert(expenses.message || "Failed to fetch expenses.");
            }
        } catch (error) {
            console.error('Error fetching expenses:', error);
            alert("An error occurred. Please try again later.");
        }
    });

    // Function to populate the expenses table
    function populateExpensesTable(expenses) {
        const tbody = document.querySelector('table tbody');

        // Clear existing rows except the first one (add expense row)
        tbody.innerHTML = `
            <tr>
                <form>
                    <td><input type="date" id="date" name="date" required class="info"></td>
                    <td><input type="text" id="category" name="category" required class="info"></td>
                    <td><input type="number" id="amount" name="amount" required class="info"></td>
                    <td><input type="text" id="description" name="description" required class="info"></td>
                    <td><button type="submit">Add</button></td>
                </form>
            </tr>
        `;

        expenses.forEach(expense => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.category}</td>
                <td>${expense.amount.toFixed(2)}</td>
                <td>${expense.description}</td>
                <td>
                    <button class="delete-button" data-id="${expense._id}">Delete</button>
                </td>
            `;

            tbody.appendChild(tr);
        });

        // Attach event listeners to delete buttons
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const expenseId = button.getAttribute('data-id');

                if (confirm("Are you sure you want to delete this expense?")) {
                    try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
                            method: 'DELETE',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        const result = await response.json();

                        if (response.ok) {
                            alert("Expense deleted successfully!");
                            // Remove the row from the table
                            button.closest('tr').remove();
                        } else {
                            alert(result.message || "Failed to delete expense.");
                        }
                    } catch (error) {
                        console.error('Error deleting expense:', error);
                        alert("An error occurred. Please try again later.");
                    }
                }
            });
        });

        // Handle adding expense from the table row form
        const addExpenseRowForm = tbody.querySelector('form');
        if (addExpenseRowForm) {
            addExpenseRowForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const date = addExpenseRowForm.querySelector('#date').value;
                const category = addExpenseRowForm.querySelector('#category').value.trim();
                const amount = parseFloat(addExpenseRowForm.querySelector('#amount').value);
                const description = addExpenseRowForm.querySelector('#description').value.trim();

                if (!date || !category || isNaN(amount) || !description) {
                    alert("Please fill in all fields correctly.");
                    return;
                }

                try {
                    const token = localStorage.getItem('token');

                    const response = await fetch('http://localhost:5000/api/expenses', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ date, category, amount, description }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert("Expense added successfully!");
                        // Optionally, refresh the expenses table
                        location.reload();
                    } else {
                        alert(result.message || "Failed to add expense.");
                    }
                } catch (error) {
                    console.error('Error adding expense:', error);
                    alert("An error occurred. Please try again later.");
                }
            });
        }
    }
}
