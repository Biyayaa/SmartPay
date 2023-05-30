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
const netWorthElement = document.getElementById("netWorth");
const recentTransactionsElement = document.getElementById("transactionsList");
const transferForm = document.getElementById("transferForm");
const savingsForm = document.getElementById("savingsForm");



const aviElement = document.getElementById("avi");
const defaultAvi = document.getElementById("defaultAvi");

if (currentUser && currentUser.avatar) {
    aviElement.style.backgroundImage = `url(${currentUser.avatar})`;
  }
  else{
    defaultAvi.style.display = "block";
  }

  
aviElement.addEventListener("click", function () {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      const imageDataURL = reader.result;

      // Save the avatar to local storage for the current user
      currentUser.avatar = imageDataURL;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // Update the avatar in the registered users' data
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
      const userIndex = registeredUsers.findIndex((user) => user.email === currentUser.email);
      if (userIndex !== -1) {
        registeredUsers[userIndex].avatar = imageDataURL;
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      }

      aviElement.style.backgroundImage = `url(${imageDataURL})`;
    });

    reader.readAsDataURL(file);
  });

  fileInput.click();
});






// Display the user's last name and greeting based on the current time
const currentHour = new Date().getHours();
const greeting =
  currentHour < 12
    ? "Good morning"
    : currentHour < 18
    ? "Good afternoon"
    : "Good evening";
greetingElement.textContent = `${greeting}, ${currentUser.lastName}!`;

// Display the user's balance
balanceElement.textContent = "#" + currentUser.balance.toFixed(2);

// Display the user's savings
savingsElement.textContent = "#" + currentUser.savings.toFixed(2);

// Function to update the net worth displayed in the UI
function updateNetWorth() {
  const netWorth = currentUser.balance + currentUser.savings;
  netWorthElement.textContent = "#" + netWorth.toFixed(2);
}
// Update the net worth when the page loads
updateNetWorth();

const transactionDateTime = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Function to add a transaction to the recent transactions list
function addTransactionToRecent(transType, transAmount, transUser) {
  const transactionDate = transactionDateTime.getDate();
  const transactionMonth = months[transactionDateTime.getMonth()];
  const transactionYear = transactionDateTime.getFullYear();
  const transactionTime = new Date().toLocaleTimeString();

  let transactionText;
  if (transType === "Sent") {
    transactionText = `Sent ${Math.abs(transAmount).toFixed(
      2
    )} to ${transUser} on ${transactionMonth} ${transactionDate}, ${transactionYear} at ${transactionTime}`;
  } else if (transType === "Saved") {
    transactionText = `Moved ${Math.abs(transAmount).toFixed(
      2
    )} to Savings on ${transactionMonth} ${transactionDate}, ${transactionYear} at ${transactionTime}`;
  } else {
    transactionText = `Received ${Math.abs(transAmount).toFixed(
      2
    )} from ${transUser} on ${transactionMonth} ${transactionDate}, ${transactionYear} at ${transactionTime}`;
  }

  let transactionItem = document.createElement("li");
  transactionItem.textContent = transactionText;
  recentTransactionsElement.insertBefore(
    transactionItem,
    recentTransactionsElement.firstChild
  );
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
  const registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // Prompt user to select recipient
  const recipientAccount = prompt("Enter recipient's Account number:");
  if (!recipientAccount) {
    return;
  }

  if (recipientAccount === currentUser.accountNumber) {
    alert("Cannot transfer money to your own account.");
    return;
  }

  // Find the recipient in the registered users
  const recipientUser = registeredUsers.find(
    (user) => user.accountNumber === recipientAccount
  );

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
    date: transactionDateTime.toLocaleString(),
  };
  currentUser.transactions = currentUser.transactions || [];
  currentUser.transactions.unshift(transaction);

  // Add transaction details to the recipient user's transaction history
  const recipientTransaction = {
    type: transType === "Sent" ? "Received" : "Sent",
    amount: Math.abs(transferAmount),
    user: `${currentUser.firstName} ${currentUser.lastName}`,
    date: transactionDateTime.toLocaleString(),
  };
  recipientUser.transactions = recipientUser.transactions || [];
  recipientUser.transactions.unshift(recipientTransaction);

  // Find the index of the current user and recipient user in the registered users list
  const currentUserIndex = registeredUsers.findIndex(
    (user) => user.accountNumber === currentUser.accountNumber
  );
  const recipientUserIndex = registeredUsers.findIndex(
    (user) => user.accountNumber === recipientUser.accountNumber
  );

  // Update the current user's balance in the registered users list
  registeredUsers[currentUserIndex].balance = currentUser.balance;
  registeredUsers[currentUserIndex].transactions = currentUser.transactions;

  // Update the recipient user's balance and transaction history in the registered users list
  registeredUsers[recipientUserIndex].balance = recipientUser.balance;
  registeredUsers[recipientUserIndex].transactions = recipientUser.transactions;

  // Save the updated user objects to local storage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  // Update the balance and networth displayed in the UI
  balanceElement.textContent = "#" + currentUser.balance.toFixed(2);
  updateNetWorth();

  // Clear the transfer amount input field
  transferAmountInput.value = "";

  alert(`Transfer of #${transferAmount.toFixed(2)} successful.`);

  // Add transaction details to recent transactions list
  addTransactionToRecent(
    transType,
    transferAmount,
    `${recipientUser.firstName} ${recipientUser.lastName}`
  );
});

// Add event listener to the savings form submission
savingsForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get the registered users from storage
  const registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

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
  currentUser.savings = currentUser.savings
    ? currentUser.savings + savingsAmount
    : savingsAmount;

  // Add transaction details to the current user's transaction history
  const transaction = {
    type: "Saved",
    amount: -savingsAmount,
    user: "Savings",
    date: transactionDateTime.toLocaleString(),
  };
  currentUser.transactions = currentUser.transactions || [];
  currentUser.transactions.unshift(transaction);

  // Find the index of the current user in the registered users list
  const currentUserIndex = registeredUsers.findIndex(
    (user) => user.accountNumber === currentUser.accountNumber
  );

  // Update the current user's balance and savings amount in the registered users list
  registeredUsers[currentUserIndex].balance = currentUser.balance;
  registeredUsers[currentUserIndex].savings = currentUser.savings;
  registeredUsers[currentUserIndex].transactions = currentUser.transactions;

  // Save the updated user objects to local storage
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  // Update the balance displayed in the UI
  balanceElement.textContent = "#" + currentUser.balance.toFixed(2);

  // Update the savings displayed in the UI
  savingsElement.textContent = "#" + currentUser.savings.toFixed(2);

  // Clear the savings amount input field
  savingsAmountInput.value = "";

  alert(`Savings of #${savingsAmount.toFixed(2)} successful.`);

  // Add transaction details to recent transactions list
  addTransactionToRecent("Saved", -savingsAmount, "Savings");
});

const requestForm = document.getElementById("requestForm");
const pendingRequestsElement = document.getElementById("pendingRequests");
const noticeElement = document.getElementById("notice");

// Load the registered users from storage
const registeredUsers =
  JSON.parse(localStorage.getItem("registeredUsers")) || [];

// Update the pending requests count on page load
updatePendingRequestsCount();

// Add event listener to the request form submission
requestForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get the request amount
  const requestAmountInput = document.getElementById("requestAmount");
  const requestAmount = parseFloat(requestAmountInput.value.trim());

  if (isNaN(requestAmount) || requestAmount <= 0) {
    alert("Please enter a valid request amount.");
    return;
  }

  // Prompt user to enter the email of the recipient
  const recipientEmail = prompt("Enter the email of the recipient:");
  if (!recipientEmail) {
    return;
  }

  // Get the registered users from storage
  const registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // Find the recipient in the registered users
  const recipientUser = registeredUsers.find(
    (user) => user.email === recipientEmail
  );

  if (!recipientUser) {
    alert("Recipient not found.");
    return;
  }

  if (currentUser.email === recipientEmail) {
    alert("You cannot request funds from yourself.");
    return;
  }

  alert("Request made.");

  // Create a request object
  const request = {
    amount: requestAmount,
    sender: `${currentUser.firstName} ${currentUser.lastName}`,
    recipientEmail: recipientEmail,
  };

  // Add the request to the recipient user's requests
  recipientUser.requests = recipientUser.requests || [];
  recipientUser.requests.unshift(request);

  // Save the updated user objects to local storage
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  // Show the request details only on the recipient's account
  if (currentUser.email === recipientEmail) {
    displayRequestDetails(request, 0);
  }

  // Update the pending requests count after making a request
  updatePendingRequestsCount();

  // Show or hide the notification based on the number of pending requests
  if (pendingRequestsElement.textContent > 0) {
    noticeElement.style.display = "block";
  } else {
    noticeElement.style.display = "none";
  }
});

function updatePendingRequestsCount() {
  // Get the number of pending requests for the current user
  const numPendingRequests = currentUser.requests
    ? currentUser.requests.length
    : 0;

  // Update the pending requests count in the DOM
  pendingRequestsElement.textContent = numPendingRequests;

  // Show or hide the notification based on the number of pending requests
  if (pendingRequestsElement.textContent > 0) {
    noticeElement.style.display = "block";
  } else {
    noticeElement.style.display = "none";
  }
}

// Display request details for the recipient user
function displayRequestDetails(request) {
  // Create a paragraph element to display the request details for the recipient
  const requestDetailsElement = document.createElement("p");
  requestDetailsElement.textContent = `Request for ${request.amount.toFixed(
    2
  )} from ${request.sender}`;

  // Create accept and reject buttons for the recipient
  const acceptButton = document.createElement("button");
  acceptButton.textContent = "Accept";
  const rejectButton = document.createElement("button");
  rejectButton.textContent = "Reject";

  // Add event listener to the accept button
  acceptButton.addEventListener("click", function () {
    const confirmAccept = confirm(
      `Are you sure you want to send ${request.amount.toFixed(2)} to ${
        request.sender
      }?`
    );

    if (confirmAccept) {
      const pin = prompt("Enter your transaction pin:");

      if (pin !== currentUser.pin) {
        alert("Incorrect PIN.");
        return;
      }

      // Get the registered users from storage
      const registeredUsers =
        JSON.parse(localStorage.getItem("registeredUsers")) || [];

      // Find the user who made the request
      const requesterUser = registeredUsers.find(
        (user) => `${user.firstName} ${user.lastName}` === request.sender
      );

      if (!requesterUser) {
        alert("Requester not found.");
        return;
      }

      // Update balances for the recipient and current user
      currentUser.balance -= request.amount;
      requesterUser.balance += request.amount;

      // Remove the accepted request from currentUser's requests
      const acceptedRequestIndex = currentUser.requests.findIndex(
        (req) =>
          req.recipientEmail === currentUser.email &&
          req.sender === request.sender &&
          req.amount === request.amount
      );
      currentUser.requests.splice(acceptedRequestIndex, 1);

      // Update currentUser's balance and requests in registeredUsers array
      const currentUserIndex = registeredUsers.findIndex(
        (user) => user.email === currentUser.email
      );
      registeredUsers[currentUserIndex].balance = currentUser.balance;
      registeredUsers[currentUserIndex].requests = currentUser.requests;

      // Save the updated user objects to local storage
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

      // Remove the request details element and buttons
      requestDetailsElement.remove();
      acceptButton.remove();
      rejectButton.remove();

      // Update the balance displayed in the UI
      balanceElement.textContent = "#" + currentUser.balance.toFixed(2);
      updateNetWorth();

      alert(`Request accepted. Amount sent to ${request.sender}.`);

      // Update the pending requests count after making a request
      updatePendingRequestsCount();
    }
  });

  // Append the request details and buttons to the recipient's section
  const recipientSection = document.getElementById("recipientSection");
  recipientSection.appendChild(requestDetailsElement);
  recipientSection.appendChild(acceptButton);
  recipientSection.appendChild(rejectButton);
}

// Check if there are pending requests for the current user
if (currentUser.requests && currentUser.requests.length > 0) {
  currentUser.requests.forEach((request) => {
    // Display request details only for the recipient
    if (currentUser.email === request.recipientEmail) {
      displayRequestDetails(request);
    }
  });
}

// Display the user's transactions
transactionsList.innerHTML =
  currentUser.transactions && currentUser.transactions.length > 0
    ? currentUser.transactions
        .map((transaction) => {
          const transactionDateTime = new Date(transaction.date);
          const transactionDate = transactionDateTime.getDate();
          const transactionMonth = months[transactionDateTime.getMonth()];
          const transactionYear = transactionDateTime.getFullYear();
          const transactionTime = transactionDateTime.toLocaleTimeString();

          let direction;
          let amount;

          if (transaction.type === "Sent") {
            direction = "to";
            amount = Math.abs(transaction.amount);
          } else if (transaction.type === "Saved") {
            direction = "to";
            amount = Math.abs(transaction.amount);
            return `<li>Moved ${amount.toFixed(
              2
            )} to Savings on ${transactionMonth} ${transactionDate}, ${transactionYear} at ${transactionTime}</li>`;
          } else {
            direction = "from";
            amount = Math.abs(transaction.amount);
          }

          return `<li>${transaction.type} ${amount.toFixed(2)} ${direction} ${
            transaction.user
          } on ${transactionMonth} ${transactionDate}, ${transactionYear} at ${transactionTime}</li>`;
        })
        .join("")
    : "No transactions available.";


    window.addEventListener('DOMContentLoaded', function() {
        const homeNavItem = document.getElementById('home');
        homeNavItem.classList.add('active');
      });







