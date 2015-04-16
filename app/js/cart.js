var cart = (function (module) {

  var buildOrderItem = function(item){
    var orderItem = {};
    var menuItem = item.attr('id');
    var count = JSON.parse(localStorage['count']);
    count += 1;
    orderItem['product_id'] = menuItem;
    orderItem['quantity'] = parseInt($('#' + menuItem +'quantity').val());
    orderItem['name'] = $('#' + menuItem +'name').text();
    orderItem['comments'] = $('#' + menuItem +'comments').val();
	  orderItem['price'] = $('#' + menuItem + 'price').text();
    orderItem['id'] = count;
    orderItem['description'] = $('#' + menuItem + 'description').text();
    orderItem['ingredients'] = $("form#" + menuItem + " input[type=checkbox]:checked").map(function() {
      return this.value;
    }).get();
    orderItem['bagel'] = $("form#" + menuItem + ' input:radio[name=bagel]:checked').val();
    localStorage['count'] = JSON.stringify(count);
    return orderItem;
  };

  renderNavCart = function(){
      var data = JSON.parse(localStorage['cart']);
      data = cart.calcCart(data);
      data.total = accounting.formatMoney(data.total);
      var template = Handlebars.compile($('#cart-render').html());
      $('#cart').html(template({
      cart: data,
    }));
  };

  module.cartIngredientRender = function(item, module){
    var ingredients = $.grep(module.ingredients, function(n){
     return item.ingredients.indexOf(n.id.toString()) > -1
    });
    item.ingredients = ingredients;
  };

  module.renderDetailedCart = function(){
      var data = JSON.parse(localStorage['cart']);

      if (data.length < 1){
        $('#content').html("<h3>You haven't added anything to your cart yet. Get shopping you cheapskate!</h3>");
      } else {

        data.forEach(function(item){
          cart.cartIngredientRender(item, aLaCart)
        });
        var template = Handlebars.compile($('#detailed-cart-render').html());
        $('#content').html(template({
          orderItem: data,
        }));
      };
  };

  var makeNum = function(price){
    return Number(price.substring(1, price.length));
  };

  var calcItemTotal = function(item){
    return makeNum(item.price) * item.quantity
  };

  module.cartReset = function(){
    localStorage.removeItem('cart');
    localStorage.setItem('cart', "[]");
    renderNavCart();
  };

  // calcCart is now a module so the preorder summary can use it
  module.calcCart = function(data){ 
    var total = 0;
    var cart = { total: 0, quantity: 0};
    data.forEach(function(item){
      cart['total'] = cart['total'] + calcItemTotal(item);
      cart['quantity'] = cart['quantity'] + item.quantity;
    });

    return cart;
  };

  var emptyCartNormalize = function(){
    if (localStorage['cart'] === undefined) {
      localStorage.setItem('cart', "[]");
    };
    if (localStorage['count'] === undefined) {
      localStorage.setItem('count', "0");
    };
  };

  var addItem = function(item){
    var orderItem = buildOrderItem(item);
    var items = JSON.parse(localStorage["cart"]);
	  // if the orderItem has the same name as a menuItem than add to the menuItem's quantity
    items.push(orderItem);
	  localStorage.setItem('cart', JSON.stringify(items));
    renderNavCart();
  	};


  var removeItem = function(item){
    var items = JSON.parse(localStorage["cart"]);
    items = $.grep(items, function(n){
     return n.id != item.val();
    });
    localStorage.setItem('cart', JSON.stringify(items));
    renderNavCart();
    cart.renderDetailedCart();
  };
	
  module.preorderCalcCart = function() {
	    var bostonZips = ["02210", "02108", "02109", "02110", "02111", "02113", "02203"]
		var data = JSON.parse(localStorage['cart']);
	  	
	  if(bostonZips.indexOf(localStorage["zipcode"]) > -1) {
			var deliveryCost = 10.00;
		} else {
			var deliveryCost = 6.00;
		}
	  
	  var subtotal = (cart.calcCart(data).total + deliveryCost);
	  var taxes =  (subtotal + deliveryCost) * 0.07;
	  var total = (subtotal + taxes);
	  
	  var formattedTaxes = accounting.formatMoney(taxes);
	  var formattedTotal = accounting.formatMoney(total);
	  var formattedSubtotal = accounting.formatMoney(subtotal);
	  var formattedDeliveryCost = accounting.formatMoney(deliveryCost);
	  
	  cart.renderPreorderSummary(formattedTaxes, formattedTotal, formattedSubtotal, formattedDeliveryCost);
  };
	
	module.renderPreorderSummary = function(taxes, total, subtotal, deliveryCost) {
		var cart = JSON.parse(localStorage['cart']);
		console.log(cart)
		var template = Handlebars.compile($('#preorder-summary-render').html());
        $('#content').html(template({
          cart: cart,
		  taxes: taxes,
		  deliveryCost: deliveryCost,
		  subtotal: subtotal,
		  total: total,
        }));
	};

  module.init = function(){

    $('#content').off().on('submit', '.menu-form', function(event){
      event.preventDefault();
      addItem($(this));
    });

    $('#content').on('click', '.remove-cart', function(event){
      event.preventDefault();
      removeItem($(this));
    });
	  
  	$('#nav-item').on('click', 'a.detailed-cart', function(event){
		//stuff goes here
		console.log("clicked");
		$('#content').empty();
	});

    emptyCartNormalize();
    renderNavCart();
  };

  return module;

})(cart || {});
