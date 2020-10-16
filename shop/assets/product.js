// console.log("product.js")

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

class Product {
  constructor() {
    // GET ALL INFO FROM THE HTML AND STORE IT INSIDE A 'product' PROPERTY
    this.product              = JSON.parse( document.querySelectorAll('[data-json-product]')[0].innerHTML );
    // INIT AN EMPTY PROP TO LATER ISOLATE SELECTED VARIANT
    this.selected_variant     	= {};
    this.selected_quantity    	= 1;
    this.size_checked          	= true;
    this.url 					= new URL(window.location.href);
    this.addExtraProps();

    // LOOK IN HTLM TO UNDERSTAND WHICH VARIANT ID IS THE SELECTED one
    var variant_id = $($('[data-variant-selected]')[0]).data('variant-selected');
    this.setSelectedVariant(variant_id);
    this.setSizeChecked();
    this.initOptionListner();
    this.initRivet();
    this.initKlaviyo();
    this.selectQuantityListner();
  }
  setSelectedVariant(id){
    // ELLE PREND UN ID EN PARAMETRE
    // ELLE FOUILLE DANS PRODUCT.VARIANTS
    // DES QU'ELLE TROUVE LE BON OBJECT VARIANT;
    // ELLE LE RANGE DANS THIS.SELECTED_VARIANT
    var _this = this;
    _this.product.variants.map( function(v){
      if (v.id == id) {
        _this.selected_variant = v;
      }
    })
    this.updateUrlParam('variant', id);
    this.setThubnailGallery();
    this.setMainGallery();
    this.listenToClickOnThubnail();
    this.selectVariantOptionsDOM();
    if (_this.selected_variant.available) {
      $('.product__alert').hide();
      $('.product__addToCart').show();
    } 
    else {
      $('.product__alert').show();
      $('.product__addToCart').hide();
    }
  }
  selectQuantityListner(){
    var _this = this;

    $('[action-increase-quantity]').click(function(event) {
      if (_this.selected_quantity < 9) {
        _this.selected_quantity++;
      }
    });
    $('[action-decrease-quantity]').click(function(event) {
      if (_this.selected_quantity > 1) {
        _this.selected_quantity--;
      }
    });
  }
  setSizeChecked(){
    var _this = this;
    if ($('.option__name').data('size-checked') == true) {
      _this.size_checked = false;
      $('.size.option__value--selected').removeClass('option__value--selected')
    }
    // console.log(_this.size_checked)
    $('.option__value.size').click(function(event) {
        _this.size_checked = true;
        // console.log(_this.size_checked)
    });
    $('.option__value.taille').click(function(event) {
        _this.size_checked = true;
        // console.log(_this.size_checked)
    });
  }
  setThubnailGallery(){
    // console.log('using setThubnailGallery function');
    // FILTRER LA thubnail GALLERY
    // SUR this.selected_variant.id
    var i = 0;
    var current_variant_id = this.selected_variant.id.toString();
    $('.product__gallery-thubnail').each(function(index, el) {
        var variant_ids = $(el).attr('variants_ids').split(' ');
        $(this).removeClass('selected');
        if ( variant_ids.includes(current_variant_id) ) {
          $(el).show();
          $(el).attr('index', i);
          if (i == 0 ) {
            $(el).addClass('selected');
          }
          i ++ ;
          $(el).addClass('visible');
        }else {
          $(el).hide();
          $(el).removeClass('visible');
          $(el).attr('index', '');
        }
    });
  }
  setMainGallery(){
    var _this = this;
    var current_variant_id = this.selected_variant.id.toString();
    var count_index = 0;

   $('.product__gallery-image').each(function(index, el) {
      var variant_ids = $(el).attr('variants_ids').split(' ');
      $(el).hide();
      if ( variant_ids.includes(current_variant_id) ) {
         $(el).addClass('visible');
         $(el).attr('index', index);
         $(el).show();
         count_index++;
      }else {
        $(el).removeClass('visible');
        $(el).attr('index', '');
      }
    });
     _this.initSlider();
     setTimeout(function () {
       _this.initSliderRecentlyView();
     }, 1500);
  }
  initSliderRecentlyView(){
    if (this.SliderRecentlyView) {
      this.SliderRecentlyView.destroy()
    }
    this.SliderRecentlyView = new Flickity( '.Carousel' , {
      pageDots: false,
      imagesLoaded: true,
      prevNextButtons: true,
      cellAlign: "center",
      dragThreshold: 8,
      imagesLoaded: true,
      arrowShape: { "x0": 20, "x1": 60, "y1": 40, "x2": 60, "y2": 35, "x3": 25},
      cellSelector: '.Carousel__Cell'
    });
  }
  initSlider(){
    if (this.slider) {
      this.slider.destroy()
    }
    this.slider = new Flickity( '.product__gallery' , {
      pageDots: false,
      prevNextButtons: true,
      dragThreshold: 8,
      imagesLoaded: true,
      arrowShape: { "x0": 20, "x1": 60, "y1": 40, "x2": 60, "y2": 35, "x3": 25},
      cellSelector: '.visible',
      fullscreen: true,
      imagesLoaded: true,
      on: {
        change: function( index ) {
          $('.product__gallery-thubnail').each(function(index2, el) {
            $(this).removeClass('selected');
            var i = $(el).attr('index');
            if (i == index) {
              $(el).addClass('selected');
            }
          });
        }
      }
    });
  }
  listenToClickOnThubnail(){
    var _this = this;
    $('.product__gallery-thubnail.visible').click(function(event) {
      $('.product__gallery-thubnail').removeClass('selected');
      $(this).addClass('selected');
      _this.slider.select( $(this).attr('index') );
    });
  }
  updateUrlParam(k, v){
    if ( this.url.searchParams.has(k) ) {
      this.url.searchParams.set(k, v);
    }else{
      this.url.searchParams.append(k, v);
    }
    if (!history.replaceState) {
      return;
    }
    window.history.replaceState( {path: this.url.href}, '', this.url.href);
  }
  selectVariantOptionsDOM(){
    // SA SEULE MISSION EST DE METTRE EN GRAS LES OPTIONS VALUES QUI CORRESPONDENT AU VARIANT SELECTIONNE 
    var _this = this;
    $(`.option__value`).removeClass('option__value--selected');
    for (var i = 0; i < _this.selected_variant.options.length; i++) {
      var value = _this.selected_variant.options[i];
      $(`.option__value[data-option-rank='${i}'][data-option-value='${value}']`).addClass('option__value--selected');
    }
  }
  initOptionListner(){
    // Avoid confusion with jQuery This
    var _this = this;

    $('.option__value').click(function(event) {
      var rank = parseInt($(this).data('option-rank'));
      var name = $(this).data('option-name');
      var value = $(this).data('option-value');
      //console.log(name);
      //console.log(value);
      //console.log(rank);
      _this.findSelectedOrFirstExistingVariant(rank, name, value);
    });

  }
  findSelectedOrFirstExistingVariant(rankClicked, nameClicked, valueClicked){
    //console.log("findSelectedOrFirstExistingVariant");
    var _this = this;
    // GET THE USER FRONT CHOICE
    _this.selected_values = [];
    //console.log("Front choice is currently");
    $('.option__value--selected').each(function(index, el, values) {
      var rank = parseInt($(this).data('option-rank'));
      var value = $(this).data('option-value').toString();
      //console.log(rank);
      //console.log(value);
      _this.selected_values[rank] = value
    });
    
    //console.log(_this.selected_values);
    
    // FORCE THE ONE CLICKED
    _this.selected_values[rankClicked] = valueClicked;
    
    //console.log("New selected values is");
 	//console.log(_this.selected_values);
    
    // REDUCE VARIANTS TO THE ONE BEHIND THE INTENDED CLICK
    var reduced_variants = []
    _this.product.variants.map(function(v){
      if ( v.options[rankClicked] == valueClicked ) {
        reduced_variants.push(v)
      }
    })
    //console.log("Variants with the intendent click are");
    //console.log(reduced_variants)

    // ON THE REDUCED VARIANTS WE LOOK FOR ONE AT LEAST MATCHING TWO OPTIONS
    var selected_or_first_available_variant = {};
    var options_values_difference = 3;

    reduced_variants.map(function(v){
      //console.log(v)
      //console.log("WIll look for a diff with ", _this.selected_values);
      
      // var diff = _this.selected_values.diff(v.options).length;
      var diff = 3 ; 
      
      
      if(_this.selected_values[0] == v.options[0]){
      	diff -= 1;
      }
      if(_this.selected_values[1] == v.options[1]){
      	diff -= 1;
      }
      if(_this.selected_values[2] == v.options[2]){
      	diff -= 1;
      }
      
      
      
      // console.log(diff);
      if ( options_values_difference > diff ) {
        //console.log("En effet c'edst plus petit comme dif");
        selected_or_first_available_variant = v;
        options_values_difference = diff;
      }
    })

    _this.setSelectedVariant(selected_or_first_available_variant.id);

  }
  initRivet(){
    var _this = this;

    rivets.formatters.not     = function(bol){
      return !bol
    }
    rivets.bind(document.querySelector('.product__header'),{
      productPage: _this
    });
  }
  addExtraProps(){
    var _this = this;
    var jsonVariants = JSON.parse( $('[data-json-variants]')[0].innerHTML);
    _this.product.variants.map(function(v){
      if ( jsonVariants[v.id] ) {
        v.extra = jsonVariants[v.id];
      }
    })
  }
  showMiniCart(){

    $('.PageOverlay').addClass("is-visible");
    $('#sidebar-cart').attr("aria-hidden", "false");

    $('.PageOverlay').off();
    $('.PageOverlay').click(function(event) {
      $('.PageOverlay').removeClass("is-visible");
      $('#sidebar-cart').attr("aria-hidden", "true");
    });
  }
  initKlaviyo(){
    var _this = this;
    var item = {
      id: _this.product.id,
      variant_id: _this.selected_variant.id,
      title: _this.product.title,
      handle: _this.product.handle,
      variant_title: _this.selected_variant.title,
      type: _this.product.type,
      featured_image: `https:${_this.product.featured_image}`,
      price: (_this.product.price/100),
      savings: ((_this.product.compare_at_price - _this.product.price)/100),
      product_description: _this.product.description.replace(/<(?:.|\n)*?>/gm, '').replace(/(\r\n|\n|\r)/gm, ""),
      compare_at_price: (_this.product.compare_at_price/100)
    };
    // console.log(item);

    // SEND VIEW PRODUCT
    _learnq.push(['track', 'Viewed Product', item]);

    // TRACK ITEM
    _learnq.push(['trackViewedItem', item]);

    // LISTEN TO ADD TO CART
    $('[action-add-to-cart]').on('click', function(event){

      var item = {
        id: _this.product.id,
        variant_id: _this.selected_variant.id,
        title: _this.product.title,
        handle: _this.product.handle,
        variant_title: _this.selected_variant.title,
        type: _this.product.type,
        featured_image: `https:${_this.product.featured_image}`,
        price: (_this.product.price/100),
        savings: ((_this.product.compare_at_price - _this.product.price)/100),
        product_description: _this.product.description.replace(/<(?:.|\n)*?>/gm, '').replace(/(\r\n|\n|\r)/gm, ""),
        compare_at_price: (_this.product.compare_at_price/100)
      };
      _learnq.push(['track', 'Added to Cart', item]);
    });
    
    
    // LISTEN TO FORM SUBMIT TO HANLDE DIFFERENT CASE
    window.addEventListener("klaviyoForms", function(e) {
      var item = {
        id: _this.product.id,
        variant_id: _this.selected_variant.id,
        title: _this.product.title,
        handle: _this.product.handle,
        variant_title: _this.selected_variant.title,
        variant_image: _this.selected_variant.featured_image.src,
        type: _this.product.type,
        featured_image: `https:${_this.product.featured_image}`,
        price: (_this.product.price/100),
        savings: ((_this.product.compare_at_price - _this.product.price)/100),
        product_description: _this.product.description.replace(/<(?:.|\n)*?>/gm, '').replace(/(\r\n|\n|\r)/gm, ""),
        compare_at_price: (_this.product.compare_at_price/100)
      };
      //console.log(e);
      if (e.detail.type == 'submit' && e.detail.formId == "M2gxtG" ){
        //console.log("klaviyo alerte stock form is submitted");
        _learnq.push(['track', 'Alert Stock', item]);
      }
    });
  }
}

window.kercambreProduct = new Product();
