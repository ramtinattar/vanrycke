$('[action-show-popup]').click( function(e) {
  e.preventDefault();
  var target = $(this).data('target');
  $("#" + target).addClass("visible");
});
$('.popup').click( function() {
  $(this).removeClass('visible');
});
$('.popup__close').click( function() {
  $(this).closest('.popup').removeClass('visible');
});
$('.popup__content').click( function(e) {
  e.stopPropagation();
});