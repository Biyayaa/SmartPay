let loader = document.getElementById("loader")

function signIn(ev) {
    ev.preventDefault();
  
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
  
    // Validate form fields
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }
  
    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
  
    let user = registeredUsers.find(function (user) {
      return user.email === email && user.password === password;
    });
  
    if (!user) {
      alert("Invalid email or password");
      return;
    }
  
    localStorage.setItem("currentUser", JSON.stringify(user));
    loader.style.display = "block";
  
    // alert("Login successful");
  
    setTimeout(() => {
      window.location.href = ".././html/dashboard.html";
    }, 2000);
  }
  