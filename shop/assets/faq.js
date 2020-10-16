//////////FAQ
// console.log("faq.js")

$('.faq__answer').hide();
$('.faq__close').hide();

$('.faq__question').click( function() {
  var binder = $(this).data('answer');
  var closeCross = $(this).data('block-id');

  $(this).closest('.faq__questions').hide();
  $(this).closest('.faq__title').hide();

  $("#"+ binder).show();
  $("#"+ closeCross).show();
});

$('.Drawer__Close').click( function(){
  $('.faq__answer').hide();
  $('.faq__questions').show();
  $(this).hide();
});

$('.faq__block').mouseenter(function() {
  $('.faq__questions').show();
  $(this).find('.faq__title').hide();
    }).mouseleave(function() {
      $('.faq__answer').hide();
      $('.faq__close').hide();
      $('.faq__question').show();
      $('.faq__title').show();
});
