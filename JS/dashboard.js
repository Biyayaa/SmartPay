// Retrieve the signed-in user's data from session storage
let currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  // Redirect to login page if user data is not available
  window.location.href = ".././html/login.html";
}

currentUser = JSON.parse(currentUser);

// Display the user's last name
// document.getElementById("lastName").textContent = currentUser.lastName;

// Get the current time
let currentTime = new Date();
let currentHour = currentTime.getHours();

// Display a greeting based on the current time
let greeting;
if (currentHour < 12) {
  greeting = "Good morning";
} else if (currentHour < 18) {
  greeting = "Good afternoon";
} else {
  greeting = "Good evening";
}
document.getElementById("greeting").textContent =
  greeting + " " + currentUser.lastName + "!";

// Display the user's balance
document.getElementById("balance").textContent = currentUser.balance.toFixed(2);

// Recent Transactions
let recentTransactionsElement = document.getElementById("transactionsList");

// Function to add a transaction to the recent transactions list
function addTransactionToRecent(transType, transAmount, transUser) {
  let transactionItem = document.createElement("li");
  let transactionText =
    transType === "Sent"
      ? "Sent " + Math.abs(transAmount).toFixed(2) + " to " + transUser
      : "Received " + Math.abs(transAmount).toFixed(2) + " from " + transUser;
  transactionItem.textContent = transactionText;
  recentTransactionsElement.appendChild(transactionItem);

  // Keep the list limited to the last 10 transactions
  if (recentTransactionsElement.children.length > 10) {
    recentTransactionsElement.removeChild(recentTransactionsElement.firstChild);
  }
}

// Add event listener to the transfer form submission
let transferForm = document.getElementById("transferForm");
transferForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get the transfer amount
  let transferAmountInput = document.getElementById("transferAmount");
  let transferAmount = parseFloat(transferAmountInput.value.trim());

  if (isNaN(transferAmount) || transferAmount <= 0) {
    alert("Please enter a valid transfer amount.");
    return;
  }

  if (transferAmount > currentUser.balance) {
    alert("Insufficient funds.");
    return;
  }

  // Get the registered users from storage
  let registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // Prompt user to select recipient
  let recipientAccount = prompt("Enter recipient's Account number:");
  if (!recipientAccount) {
    return;
  }

  // Find the recipient in the registered users
  let recipientUser = registeredUsers.find(function (user) {
    return user.accountNumber === recipientAccount;
  });

  if (!recipientUser) {
    alert("Recipient not found.");
    return;
  }

  // Update balances for the current user and recipient
  currentUser.balance -= transferAmount;
  recipientUser.balance += transferAmount;

  // Add transaction details to the current user's transaction history
  let transType = transferAmount > 0 ? "Sent" : "Received";
  let transaction = {
    type: transType,
    amount: transferAmount,
    user: recipientUser.firstName + " " + recipientUser.lastName,
  };
  currentUser.transactions = currentUser.transactions || [];
//   currentUser.transactions.push(transaction);
currentUser.transactions.unshift(transaction);


  // Add transaction details to the recipient user's transaction history
  let recipientTransaction = {
    type: transType === "Sent" ? "Received" : "Sent",
    amount: Math.abs(transferAmount),
    user: currentUser.firstName + " " + currentUser.lastName,
  };
  recipientUser.transactions = recipientUser.transactions || [];
  recipientUser.transactions.unshift(recipientTransaction);

  // Find the index of the current user and recipient user in the registered users list
  let currentUserIndex = registeredUsers.findIndex(function (user) {
    return user.accountNumber === currentUser.accountNumber;
  });

  let recipientUserIndex = registeredUsers.findIndex(function (user) {
    return user.accountNumber === recipientUser.accountNumber;
  });

  // Update the current user's balance in the registered users list
  registeredUsers[currentUserIndex].balance = currentUser.balance;
  registeredUsers[currentUserIndex].transactions = currentUser.transactions;

  // Update the recipient user's balance and transaction history in the registered users list
  registeredUsers[recipientUserIndex].balance = recipientUser.balance;
  registeredUsers[recipientUserIndex].transactions = recipientUser.transactions;

  // Save the updated user objects to local storage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  // Update the balance displayed in the UI
  document.getElementById("balance").textContent =
    currentUser.balance.toFixed(2);

  // Clear the transfer amount input field
  transferAmountInput.value = "";

  alert(`Transfer of #${transferAmount.toFixed(2)} successful.`);

  // Add transaction details to recent transactions list
  transType = transferAmount > 0 ? "Sent" : "Received";
  let transUser = recipientUser.firstName + " " + recipientUser.lastName;
  addTransactionToRecent(transType, transferAmount, transUser);
});

// Add event listener to the savings form submission
let savingsForm = document.getElementById("savingsForm");
savingsForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get the registered users from storage
  let registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // Get the savings amount
  let savingsAmountInput = document.getElementById("savingsAmount");
  let savingsAmount = parseFloat(savingsAmountInput.value.trim());

  if (isNaN(savingsAmount) || savingsAmount <= 0) {
    alert("Please enter a valid savings amount.");
    return;
  }

  if (savingsAmount > currentUser.balance) {
    alert("Insufficient balance.");
    return;
  }

  // Update the balance and savings amount for the current user
  currentUser.balance -= savingsAmount;
  currentUser.savings = currentUser.savings
    ? currentUser.savings + savingsAmount
    : savingsAmount;

  // Add transaction details to the current user's transaction history
  let transaction = {
    type: "Saved",
    amount: -savingsAmount,
    user: "Savings",
  };
  currentUser.transactions = currentUser.transactions || [];
//   currentUser.transactions.push(transaction);
currentUser.transactions.unshift(transaction);

  // Find the index of the current user in the registered users list
  let currentUserIndex = registeredUsers.findIndex(function (user) {
    return user.accountNumber === currentUser.accountNumber;
  });

  // Update the current user's balance and savings amount in the registered users list
  registeredUsers[currentUserIndex].balance = currentUser.balance;
  registeredUsers[currentUserIndex].savings = currentUser.savings;
  registeredUsers[currentUserIndex].transactions = currentUser.transactions;

  // Save the updated user objects to local storage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  // Update the balance displayed in the UI
  document.getElementById("balance").textContent =
    currentUser.balance.toFixed(2);

  // Clear the savings amount input field
  savingsAmountInput.value = "";

  alert(`Savings of #${savingsAmount.toFixed(2)} successful.`);

  // Add transaction details to recent transactions list
  addTransactionToRecent("Saved", -savingsAmount, "Savings");
});

// Display the user's transactions
let transactionsList = document.getElementById("transactionsList");

// Clear any existing transactions
transactionsList.innerHTML = "";

// Determine the starting index based on the number of transactions and limit to the last 10
let startIndex = Math.max(0, currentUser.transactions.length - 20);

// Iterate through the user's transactions starting from the determined index
for (let i = startIndex; i < currentUser.transactions.length; i++) {
  let transaction = currentUser.transactions[i];

  // Create a list item for the transaction
  let listItem = document.createElement("li");

  // Determine the transaction direction based on the transaction type
  let direction;
  if (transaction.type === "Sent") {
    direction = "to";
  } else if (transaction.type === "Saved") {
    direction = "to";
    transaction.amount = Math.abs(transaction.amount);
  } else {
    direction = "from";
    transaction.amount = Math.abs(transaction.amount);
  }

  // Set the text content of the list item
  listItem.textContent = `${transaction.type}: ${transaction.amount.toFixed(2)} ${direction} ${transaction.user}`;

  // Add the list item to the transactions list
  transactionsList.appendChild(listItem);
}

