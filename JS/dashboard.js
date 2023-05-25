// Retrieve the signed-in user's data from session storage
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
  // Redirect to login page if user data is not available
  window.location.href = ".././html/login.html";
}

// Cache frequently used elements
const greetingElement = document.getElementById("greeting");
const balanceElement = document.getElementById("balance");
const savingsElement = document.getElementById("savi");
const recentTransactionsElement = document.getElementById("transactionsList");
const transferForm = document.getElementById("transferForm");
const savingsForm = document.getElementById("savingsForm");

// Display the user's last name and greeting based on the current time
const currentHour = new Date().getHours();
const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";
greetingElement.textContent = `${greeting} ${currentUser.lastName}!`;

// Display the user's balance
balanceElement.textContent = currentUser.balance.toFixed(2);

// Display the user's savings
savingsElement.textContent = currentUser.savings.toFixed(2);
const transactionDateTime = new Date();
// Function to add a transaction to the recent transactions list
function addTransactionToRecent(transType, transAmount, transUser) {
    let transactionText;
    const transactionDate = transactionDateTime.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    const transactionTime = new Date().toLocaleTimeString();
  
    if (transType === "Sent") {
      transactionText = `Sent ${Math.abs(transAmount).toFixed(2)} to ${transUser} on ${transactionDate} at ${transactionTime}`;
    } else if (transType === "Saved") {
      transactionText = `Moved ${Math.abs(transAmount).toFixed(2)} to Savings on ${transactionDate} at ${transactionTime}`;
    } else {
      transactionText = `Received ${Math.abs(transAmount).toFixed(2)} from ${transUser} on ${transactionDate} at ${transactionTime}`;
    }
  
    let transactionItem = document.createElement("li");
    transactionItem.textContent = transactionText;
    recentTransactionsElement.insertBefore(transactionItem, recentTransactionsElement.firstChild);
  }
  

// Add event listener to the transfer form submission
transferForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get the transfer amount
  const transferAmountInput = document.getElementById("transferAmount");
  const transferAmount = parseFloat(transferAmountInput.value.trim());

  if (isNaN(transferAmount) || transferAmount <= 0) {
    alert("Please enter a valid transfer amount.");
    return;
  }

  if (transferAmount > currentUser.balance) {
    alert("Insufficient funds.");
    return;
  }

  // Get the registered users from storage
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // Prompt user to select recipient
  const recipientAccount = prompt("Enter recipient's Account number:");
  if (!recipientAccount) {
    return;
  }

  // Find the recipient in the registered users
  const recipientUser = registeredUsers.find(user => user.accountNumber === recipientAccount);

  if (!recipientUser) {
    alert("Recipient not found.");
    return;
  }

  // Get the PIN input value
  let pin = prompt("Enter your transaction pin:");
//   pin = pinInput.value.trim();

  if (pin !== currentUser.pin) {
    alert("Incorrect PIN.");
    return;
  }

  // Update balances for the current user and recipient
  currentUser.balance -= transferAmount;
  recipientUser.balance += transferAmount;

  // Add transaction details to the current user's transaction history
  const transType = transferAmount > 0 ? "Sent" : "Received";
  const transaction = {
    type: transType,
    amount: transferAmount,
    user: `${recipientUser.firstName} ${recipientUser.lastName}`,
    date: transactionDateTime.toLocaleString()
  };
  currentUser.transactions = currentUser.transactions || [];
  currentUser.transactions.unshift(transaction);

  // Add transaction details to the recipient user's transaction history
  const recipientTransaction = {
    type: transType === "Sent" ? "Received" : "Sent",
    amount: Math.abs(transferAmount),
    user: `${currentUser.firstName} ${currentUser.lastName}`,
    date: transactionDateTime.toLocaleString()
  };
  recipientUser.transactions = recipientUser.transactions || [];
  recipientUser.transactions.unshift(recipientTransaction);

  // Find the index of the current user and recipient user in the registered users list
  const currentUserIndex = registeredUsers.findIndex(user => user.accountNumber === currentUser.accountNumber);
  const recipientUserIndex = registeredUsers.findIndex(user => user.accountNumber === recipientUser.accountNumber);

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
  balanceElement.textContent = currentUser.balance.toFixed(2);

  // Clear the transfer amount input field
  transferAmountInput.value = "";

  alert(`Transfer of #${transferAmount.toFixed(2)} successful.`);

  // Add transaction details to recent transactions list
  addTransactionToRecent(transType, transferAmount, `${recipientUser.firstName} ${recipientUser.lastName}`);
});

// Add event listener to the savings form submission
savingsForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get the registered users from storage
  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // Get the savings amount
  const savingsAmountInput = document.getElementById("savingsAmount");
  const savingsAmount = parseFloat(savingsAmountInput.value.trim());

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
  currentUser.savings = currentUser.savings ? currentUser.savings + savingsAmount : savingsAmount;

  // Add transaction details to the current user's transaction history
  const transaction = {
    type: "Saved",
    amount: -savingsAmount,
    user: "Savings",
    date: transactionDateTime.toLocaleString()
  };
  currentUser.transactions = currentUser.transactions || [];
  currentUser.transactions.unshift(transaction);

  // Find the index of the current user in the registered users list
  const currentUserIndex = registeredUsers.findIndex(user => user.accountNumber === currentUser.accountNumber);

  // Update the current user's balance and savings amount in the registered users list
  registeredUsers[currentUserIndex].balance = currentUser.balance;
  registeredUsers[currentUserIndex].savings = currentUser.savings;
  registeredUsers[currentUserIndex].transactions = currentUser.transactions;

  // Save the updated user objects to local storage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  // Update the balance displayed in the UI
  balanceElement.textContent = currentUser.balance.toFixed(2);

  // Update the savings displayed in the UI
  savingsElement.textContent = currentUser.savings.toFixed(2);

  // Clear the savings amount input field
  savingsAmountInput.value = "";

  alert(`Savings of #${savingsAmount.toFixed(2)} successful.`);

  // Add transaction details to recent transactions list
  addTransactionToRecent("Saved", -savingsAmount, "Savings");
});

// Display the user's transactions
transactionsList.innerHTML = currentUser.transactions
  .slice(0, 20)
  .map(transaction => {
    let direction;
    let amount;

    if (transaction.type === "Sent") {
      direction = "to";
      amount = Math.abs(transaction.amount);
    } else if (transaction.type === "Saved") {
      direction = "to";
      amount = Math.abs(transaction.amount);
      return `<li>Moved ${amount.toFixed(2)} to Savings on ${transaction.date}</li>`;
    } else {
      direction = "from";
      amount = Math.abs(transaction.amount);
    }

    return `<li>${transaction.type} ${amount.toFixed(2)} ${direction} ${transaction.user} on ${transaction.date}</li>`;
  })
  .join("");

