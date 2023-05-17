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
   else {
    function accountNumber() {
        let randomNumber = Math.floor(Math.random() * 9999999999);
        let accountNumber = randomNumber.toString();
        return accountNumber;
      }
    // Retrieve registered users from local storage
    let registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    // Check if user already exists
    let userExists = registeredUsers.some(function (user) {
      return user.email === email || user.phoneNumber === phoneNumber;
    });

    if (userExists) {
      alert("User with the same email or phone number already exists");
      return;
    }

    // Save new user to registered users
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      password: password,
      accountNumber: accountNumber(), // Assign the generated accountNo to accountNumber
      balance: 10000.0,
      pin: null,
    };
    registeredUsers.push(newUser);

    // Update registered users in local storage
    localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

    alert("Signup successful");
    signupForm.reset();

    setTimeout(() => {
      window.location.href = ".././html/accloading.html";
    }, 2000);
  }
}


// Retrieve registered users from local storage
let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];

let numberBox = document.getElementById("numberBox");

registeredUsers.forEach(function (user) {
  numberBox.innerHTML = user.accountNumber;
  console.log(user.accountNumber);
});

