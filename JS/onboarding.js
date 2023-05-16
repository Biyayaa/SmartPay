let track =document.getElementById("virtualCard");
let airtime =document.getElementById("airtime");
let send =document.getElementById("send");
let secure =document.getElementById("secure");

track.style.display = "none";
airtime.style.display = "none";
send.style.display = "none";
secure.style.display = "none";



// Set the current slide index to 0
let slideIndex = 0;

// Create a function to show the next slide
function nextSlide() {
  // Hide the current slide
  document.getElementById("slides").children[slideIndex].style.display = "none";

  // Increase the slide index by 1
  slideIndex++;

  // If the slide index is greater than the number of slides, reset it to 0
  if (slideIndex >= document.getElementById("slides").children.length) {
    slideIndex = 0;
  }

  // Show the next slide
  document.getElementById("slides").children[slideIndex].style.display = "block";
}

// Create a function to start the slideshow
function startSlideshow() {
  // Set the interval to 3 seconds
  let interval = setInterval(nextSlide, 5000);
}

// Start the slideshow when the page loads
window.onload = startSlideshow;
