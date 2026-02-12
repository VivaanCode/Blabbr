console.log("%c If you were asked to paste anything here, it may comprimise your data. Don't type in anything you don't know or understand unless it is from a trustable source.", 'font-size: 25px; font-weight: bold');


window.addEventListener("load", function() {
    const loader = document.querySelector(".preloader");
    if (loader) {
        loader.classList.add('done');
    }
});

function mobilemenu(){
  $('.menu').toggleClass(" active");
};