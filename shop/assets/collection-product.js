// console.log("collection-product.js");


class Collection {
  constructor() {
    this.selectCatgoriesListner();
    this.selectFilterListner();
    this.resetListner();
    // EVENT LISTNER
    $(document).on('kercambre:sorted:end', function(event) {
      event.preventDefault();
      /* Act on the event */
      var empty = 0;
      var filter_value_array = [];
      var filter_options_array = [];

      $('.filter__value--selected').each(function(index, el) {
        if (!filter_options_array.includes(`${$(this).data('key-handle')}`)) {
          filter_options_array.push(`${$(this).data('key-handle')}`);
        }
        if (!filter_value_array.includes(`${$(this).data('value-handle')}`)) {
          filter_value_array.push(`${$(el).data('value-handle')}`);
        }
      });

      var filterValue = filter_value_array.length ? filter_value_array.join(', ') : 'All';

      $('.collection__custom-grid').each(function(index, el) {

        var value_1 = $(el).data('option_1');
        var value_2 = $(el).data('option_2');
        var value_3 = $(el).data('option_3');
        var type = $(el).data('type');
        var nb_filter = 0;
        var item = $(el);
        var check = 0;

        filterValue == 'All' ? $(item).show() : $(item).hide();
        nb_filter = filter_options_array.length
        $.each( filter_value_array, function( key, v ) {
            if ( v == value_1 || v == value_2 || v == value_3 || v == type ) {
              check++;
              if (check == nb_filter ) {
                  $(item).show();
                  empty++;
              }
            }
            else if (v == "All") {
              $(item).show();
              empty++;
            }
          });
      });
      if (empty == 0) {
         $('.collection__empty').css("display", "block");
         $('.Pagination').css("display", "none");
      }
      else {
        $('.collection__empty').css("display", "none");
      }
    });
  }
  selectCatgoriesListner(){
    $('.filter__categories').click( function() {
      // console.log('change categories');
      var categorie = $(this).data('value-handle');
      $(`.filter__categories[data-value-handle="${categorie}"]`).toggleClass('filter__value--selected');

      if ($('.filter__categories').hasClass('filter__value--selected')) {
        $('.filter__reset').addClass('filter__reset--available');
        $('.collection__custom-grid').each(function(index, el) {
          var type = $(el).data('type');
          var item = $(el);
          $(item).hide();
          if (categorie == type) {
            $(item).show();
          }
        });
      }
    });
  }
  selectFilterListner(){

    
    
    /*    */

    function setPastille(){
      $( $('.CollectionToolbar__Group .hidden-pocket.filters')[0]).find('.hidden-pocket.filters').find('.filter__option').each(function(i,el){
        console.log(el);
        var length = $(el).find('.Collapsible--autoExpand--hidden-pocket').find('.filter__value--selected').length;
        console.log(length);
        $(el).find('.filter__option-indicator').text(`(${length})`);
        if(length == 0){ $(el).find('.filter__option-indicator').text(''); }
      });
    }
    
    
    $('.filter__reset').click(function(){
      

      
      
      $('.filter__value').removeClass('filter__value--selected');
      setPastille();
      
      $('.collection__custom-grid').each(function(i, el){
        $(el).show();
      });
      
      
    })

    $('.filter__value').click( function() {
    
    	var _this = this;
     	var $el   = 	$(_this);
        var key_h =  	$el.data('key-handle');
        var val_h = 	$el.data('value-handle');
      	
      	console.log(key_h);
      	console.log(val_h);
      
      	// FRONT CSS SELECTED
      	$(`.filter__value[data-key-handle="${key_h}"][data-value-handle="${val_h}"]`).toggleClass('filter__value--selected');
      
      
      
      
       	// GET ALL FILTERS 
      	var filterObject = {
          'or': [],
          'diamant' : [],
          'modele': [],
          'categories': []
        }
      
      	$( $('.CollectionToolbar__Group .hidden-pocket.filters')[0]).find('.hidden-pocket.filters').find('.filter__option').each(function(i,el){
            
            $(el).find('.filter__value--selected').each(function(i,el){
              var filter_key_h = $(el).data('key-handle');
              var filter_val_h = $(el).data('value-handle');
              
              console.log(filter_key_h);
              console.log(filter_val_h);
              
              filterObject[filter_key_h].push(filter_val_h)
            })
            
          
        });
      
      	console.log(filterObject);
      
      
      
      
        function applyFiltersToElement(product){
   			
          // TEST OR
		  var testOr = false;
          var or_value = $(product).data('or');
          if( filterObject['or'].length ){
          	testOr = filterObject['or'].includes(or_value);
          }else{
          	testOr = true;
          }
          
          
          
          // TEST DIAMANT
          var testDiamant = false;
          var d_value = $(product).data('diamant');
          if( filterObject['diamant'].length ){
          	testDiamant = filterObject['diamant'].includes(d_value);
          }else{
          	testDiamant = true;
          }

          
          
          // TEST MODELE
          var testModele = false;
          var m_value = $(product).data('modele');
          if( filterObject['modele'].length ){
          	testModele = filterObject['modele'].includes(m_value);
          }else{
          	testModele = true;
          }
          
          
          // TEST CATEGORIES
          var testCategories = false;
          var m_value = $(product).data('categories');
          if( filterObject['categories'].length ){
          	testCategories = filterObject['categories'].includes(m_value);
          }else{
          	testCategories = true;
          }
          
          
          
          if( testOr && testDiamant && testModele && testCategories ){
          	$(product).show();
          }else{
          	$(product).hide();
          }
          
          
          
        }
      
      
      	// LOOP ON ALL PRODUCT TO SEE IF IT MATCHES THE CURRENT CHOICE
        $('.collection__custom-grid').each(function(i,el){
          
          // JE LES MASQUES TOUS
          $(el).hide();
          
          if( $('.filter__value--selected').length ){
            // SI Y A UN FILTRE JE REFLECHIS A LE MONTRER
            applyFiltersToElement(el);
          }
          else{
            // SI Y A PAS DE FILTRE JE LE MONTRE
            $(el).show()
          }
          
        });
      
      
      	// SET CORRECT PASTILLE
		setPastille();

      	
    
    });
    
   
  }
  resetListner() {

  }
}

$('.PageContainer').click(function(){
  $('#collection-sort-popover').attr("aria-expanded", "false");
});
$('.CollectionToolbar__Item--sort').hover(function() {
  $('.CollectionToolbar__Item--sort').trigger('click');
});
$('#collection-sort-popover').hover(function() {
  $('.CollectionToolbar__Item--sort').trigger('click');
}, function() {
  $('.PageContainer').trigger('click');
});

window.kercambreCollection = new Collection();
