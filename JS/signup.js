const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validate form fields
  if (!firstName || !lastName || !email || !phoneNumber || !password || !confirmPassword) {
    alert('Please fill in all fields');
    return;
  }

  if (password.length < 6) {
    alert('Password should be at least 6 characters long');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  // Save form data to local storage
  const user = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    password: password
  };

  localStorage.setItem('user', JSON.stringify(user));

  alert('Signup successful');
  signupForm.reset();
});
