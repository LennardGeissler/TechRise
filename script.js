//-----Slideshow Homepage-----//
let slideIndex = 1;

const plusSlides = (n) => {
    showSlides(slideIndex += n);
}

const currentSlide = (n) => {
    showSlides(slideIndex = n);
}

const showSlides = (n) => {
    let i;
    let slides = document.getElementsByClassName("slide");
    let slideNumber = document.getElementById("slideNumber");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slides[slideIndex-1].style.display = "block";
    if (n == 5) { n = 1; }
    slideNumber.innerHTML = n + " / 4";
}

showSlides(slideIndex);