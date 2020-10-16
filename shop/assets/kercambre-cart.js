
// console.log("reading kercambre cart js file")

class Panier {
  constructor(json) {

    var _this = this;
    CartJS.init(json);
    _this.CartJS = CartJS;
    _this.$miniCart = $('.minicart');
    _this.selected_quantity = 1;
    _this.initRivet();
    _this.initAddToCartListner();
    _this.setCheckGift();
    _this.MiniCartListener()

    $(document).on('cart.ready', function(event, cart) {
      console.log("cart ready");
      _this.lineItemAdjustListners();
    });
    $(document).on('cart.requestComplete', function(event, cart) {
      console.log("completed");
      _this.lineItemAdjustListners();
    });

    _this.lineItemAdjustListners();
  }
  setCheckGift(){
    $('.cart-attribute__checkbox').on('click', function(event) {
      if (CartJS.cart.attributes['cadeau'] == "No") {
        CartJS.setAttribute('cadeau', "Yes");
      }
      else {
          CartJS.setAttribute('cadeau', "No");
      }
    });
  }
  initRivet(){
    var _this = this;
    // RELIER RIVERT A UNE DIV .minicart
    rivets.formatters.money = function(price){
      price = parseInt(price) / 100 ;
      return "EUR " + price;
    }
    rivets.formatters.quantity = function(quantity){
      return "Quantité " + quantity;
    }
    rivets.formatters.size = function(options_with_values){
      for (var i = 0; i < options_with_values.length; i++) {
        var option = options_with_values[i];
        if ( option.name == "Size" || option.name == "Taille" ) {
          return "Taille: "+ option.value
        }
      }

    }
    rivets.formatters.name = function(title){
      title = title.split('-')[0];
      return title;
    }
    rivets.bind(document.querySelector('[data-cart-k]'),{
      kercambreCartJS : _this
    });
  }
  initAddToCartListner(){
    var _this = this;
    $('[action-add-to-cart]').on('click', function(event) {
      var v_id = window.kercambreProduct.selected_variant.id ;
      var properties = {
        subtitle: window.kercambreProduct.selected_variant.extra.fra.subtitle
      }
      if (window.kercambreProduct.size_checked == true) {
        _this.CartJS.addItem(v_id, window.kercambreProduct.selected_quantity , properties , {
          "success": function(data, textStatus, jqXHR) {
            setTimeout(function(){
              _this.$miniCart.toggleClass('deployed');
              $('#message').removeClass('message-error');
              $('#message').addClass('message-success');
              $('#message').html("Vous venez d'ajouter un produit au panier");
            }, 500);
          },
          "error": function(jqXHR, textStatus, errorThrown) {
            $('#message').addClass('message-error');
            $('#message').html("Oops Il y a eu un problème lors de l'ajout au Panier!");
          }
        });

      } else {
        console.log(window.kercambreProduct.size_checked)
        $('#message').addClass('message-error');
        $('#message').html("Sélectionner une taille");
      }
    });
  }
  lineItemAdjustListners(){
    var _this = this;
    $('[action-cart-adjust]').off().on('click', function(event) {
      var line          = parseInt($(this).data('line')) + 1;
      var method        = $(this).data('method');
      switch (method) {
        case 'delete':
          _this.CartJS.removeItem(line,{
            "success": function(data, textStatus, jqXHR) {
                // console.log("ok");
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                // console.log("pas ok delete");
            }
          });
          break;
        case 'add':
          var newQuantity = _this.CartJS.cart.items[(line-1)].quantity + 1;
          _this.CartJS.updateItem(line, newQuantity);
          break;
        case 'remove':
          var newQuantity = _this.CartJS.cart.items[(line-1)].quantity - 1;
          _this.CartJS.updateItem(line, newQuantity);
          break;
        default:
          console.log("dont know what to do");
      }
    })
  }
  MiniCartListener(){
    var _this = this;
    $('.minicart__overlay').click(function(event) {
      _this.$miniCart.removeClass('deployed');
    });
    $('[action-cart-close]').click(function(event) {
      _this.$miniCart.removeClass('deployed');
    });
    $("[action-cart-deployed]").click(function(event) {
      _this.$miniCart.addClass('deployed');
    });
  }
}


window.kercambreCartJS = new Panier(JSON.parse($('[data-json-cart]')[0].innerHTML));




/*
Method1: Initialiser CART JS.

Donc la faut lire la doc de CartJS et ensuite, faut attacher CartJS à  _this.cart
ou plutot _this.CartJS

ensuite, faut faire

Method2 qui a pour but d'écouter tous les clicks sur [action-add-to-cart]

et qui lorsuq'lle se déclenche vas faire _this.CartJSNew.addItem( ID)

avec :
var ID = window.productPage.selected_variant.id
*/
