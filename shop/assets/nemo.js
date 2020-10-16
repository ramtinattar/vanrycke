
class Nemo {
  constructor() {
    // console.log("nemo js");
    var $elem = $('.HorizontalList__Item.is-active');
    $('.HorizontalList__Item').hover(function() {
      $elem.removeClass('is-active');
    }, function() {
      $elem.addClass('is-active');
    });


    $('[action-show-reset]').on('click', function(event) {
      event.preventDefault();
      $('.form__login').fadeOut(400, function() {
        $('.form__reset').fadeIn(400, function() {
        });
      });
    });
  }
}

var nemo = new Nemo();