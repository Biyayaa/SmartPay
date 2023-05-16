let track =document.getElementById("virtualCard");
let airtime =document.getElementById("airtime");
let send =document.getElementById("send");
let secure =document.getElementById("secure");

track.style.display = "none";
airtime.style.display = "none";
send.style.display = "none";
secure.style.display = "none";

// Get the progress bars
const progressBars = document.getElementById("slideProgress").children;



// Set the current slide index to 0
let slideIndex = 0;

// Set the corresponding progress bar color
progressBars[slideIndex].style.backgroundColor = "#d7fd73";

// Create a function to show the next slide
function nextSlide() {
  // Hide the current slide
  document.getElementById("slides").children[slideIndex].style.display = "none";

  // Reset the progress bar color
  progressBars[slideIndex].style.backgroundColor = "";


  // Increase the slide index by 1
  slideIndex++;

  // If the slide index is greater than the number of slides, reset it to 0
  if (slideIndex >= document.getElementById("slides").children.length) {
    slideIndex = 0;
  }

  // Show the next slide
  document.getElementById("slides").children[slideIndex].style.display = "block";

   // Set the corresponding progress bar color
   progressBars[slideIndex].style.backgroundColor = "#d7fd73";
}

// Create a function to start the slideshow
function startSlideshow() {
  // Set the interval to 3 seconds
  let interval = setInterval(nextSlide, 5000);
}

// Start the slideshow when the page loads
window.onload = startSlideshow;


let getStarted = document.getElementById("getStartedBtn")

getStarted.addEventListener("click", ()=>{
    window.location.href =".././html/signup.html"
})