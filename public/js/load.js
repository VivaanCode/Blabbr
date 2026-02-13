window.addEventListener("load", function() {
    const loader = document.querySelector(".preloader");
    if (loader) {
        loader.classList.add('done');
    }
});

function mobilemenu(){
  $('.menu').toggleClass(" active");
};