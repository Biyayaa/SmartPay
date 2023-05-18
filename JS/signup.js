function signUp(ev) {
  ev.preventDefault();

  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let email = document.getElementById("email").value;
  let phoneNumber = document.getElementById("phoneNumber").value;
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  // Validate form fields
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !password ||
    !confirmPassword
  ) {
    alert("Please fill in all fields");
    return;
  }

  if (password.length < 6) {
    alert("Password should be at least 6 characters long");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  function accountNumber() {
    let randomNumber = Math.floor(Math.random() * 9999999999);
    let accountNumber = randomNumber.toString();
    return accountNumber;
  }

  let registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

  let userExists = registeredUsers.some(function (user) {
    return user.email === email || user.phoneNumber === phoneNumber;
  });

  if (userExists) {
    alert("User with the same email or phone number already exists");
    return;
  }

  let newUser = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    password: password,
    accountNumber: accountNumber(),
    balance: 10000.0,
    pin: null,
  };
  registeredUsers.push(newUser);

  let loader = document.getElementById("loader");

  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

  loader.style.display = "block";

  // signupForm.reset();
  
  setTimeout(() => {
    alert("Signup successful");
    window.location.href = ".././html/accloading.html";
  }, 2000);
}

let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
let numberBox = document.getElementById("numberBox");

registeredUsers.forEach(function (user) {
  numberBox.innerHTML = user.accountNumber;
  console.log(user.accountNumber);
});

function next() {
  window.location.href = ".././html/setpin.html";
}

function updatePin() {
  let pinBoxValue = document.getElementById("pinBox").value;
  let confirmPinBoxValue = document.getElementById("confirmpinBox").value;
  let registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

  let currentUserIndex = registeredUsers.findIndex(function (user) {
    return user.pin === null;
  });

  if (currentUserIndex === -1) {
    alert("Pin has already been set for the current user");
    return;
  }

  // Ensure pinBoxValue and confirmPinBoxValue contain only numbers
  if (!/^\d+$/.test(pinBoxValue) || !/^\d+$/.test(confirmPinBoxValue)) {
    alert("Please enter only numeric values for the pin");
    return;
  }

  // Limit pinBoxValue and confirmPinBoxValue to a maximum of four digits
  if (pinBoxValue.length > 4 || confirmPinBoxValue.length > 4) {
    alert("The pin should not exceed four digits");
    return;
  }

  if (pinBoxValue === confirmPinBoxValue) {
    registeredUsers[currentUserIndex].pin = pinBoxValue;
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    alert("Transaction pin set successfully");
    window.location.href = ".././html/login.html"
  } else {
    alert("Transaction pins do not match");
  }

  
  
}
