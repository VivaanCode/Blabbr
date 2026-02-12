$(document).ready(function() {
    $("a").on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });
});
/*
$(window).scroll(function() {
   if($(this).scrollTop() > 30) {
     $(".nav").addclass("acvive");
   }
}) */

$(window).on("scroll", function() {
    if($(window).scrollTop() > 50) {
        $(".nav").addClass("active");
    } else {
        //remove the background property so it comes transparent again (defined in your css)
       $(".nav").removeClass("active");
    }
});