var registration = (function (module) {

	var authToken;
	var customerId;

	module.submitRegistration = function () {
		$.ajax({
				url: 'http://bobs-bagels-api.herokuapp.com/users',
				type: 'POST',
				data: {user: {
				first_name: $('#first-name').val(),
				last_name: $('#last-name').val(),
				email: $('#email').val(),
				phone_number: $('#phone_number').val(),
				address_1: $('#address_1').val(),
				address_2: $('#address_2').val(),
				address_zipcode: $('#address_zipcode').val(),
				password: $('#password').val()}},
			}).done(registration.loginSuccess).fail(registration.acceptFailure);

		return false;
	};

	// var registrationValidation = function(){
 //    var $form = $('#registration-form');
 //    var validPhone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
 //    var validAddress = /^\s*\S+(?:\s+\S+){2}/;
 //    var validEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
 //    var validName = /^[a-z ,.'-]+$/i;

 //              	debugger;
 //      if(order.zips.indexOf($('#address_zipcode').val()) > -1) {
 //        if (validPhone.test($('#phone_number').val())) {
 //          if (validAddress.test($('#address_1').val())) {
 //          	if (validName.text($('#first-name').val())){
 //          		if (validName.text($('#last-name').val())){
 //          				registration.submitRegistration();
 //          		} else {
 //          				$form.find('.registration-errors').text("You must enter a valid last name.");
 //          		};
 //          	} else {
 //          			$form.find('.registration-errors').text("You must enter a valid first name.");
 //          	};
 //          } else {
 //             $form.find('.registration-errors').text("You must enter a valid address.");
 //          };
 //        } else {
 //        $form.find('.registration-errors').text("You must enter a valid phone number.");
 //        };
 //      } else {
 //        $form.find('.registration-errors').text("You must be desperate for bagels. We don't deliver that far!");
 //      };
 //  };

	module.loginSuccess = function (userData) {
		localStorage.setItem('authToken', userData.token);
    	localStorage.setItem('customerId', userData.customer_id);
		console.log('logged in!');
		window.location.href = '/';
	};

	module.submitLogin = function (event) {
		$.ajax({
				url: 'http://bobs-bagels-api.herokuapp.com/users/sign_in',
				type: 'POST',
				data: {email: $('#email').val(), password: $('#password').val()},
			}).done(registration.loginSuccess).fail(registration.acceptFailure);

		return false;
	};

	module.setupAjaxRequests = function () {
		$.ajaxPrefilter(function (options) {
			options.headers = {};
			options.headers['AUTHORIZATION'] = "Token token=" + authToken; // this is weird
		});
	};

	module.acceptFailure = function (error) {
		if (error.status === 401) { // 401 is unauthorized
			console.log('SEND TO LOGIN SCREEN');
			window.location.href = '#/registration';
		};
	};

	module.init = function () {
		console.log('yo in the registration');
		authToken = localStorage.getItem('authToken');

		registration.setupAjaxRequests();

		$('#content').on('click', '#registration-submit', function(event){
			event.preventDefault();
			registration.submitRegistration();
		});

		$('#content').on('submit', '#login-form', function(event){
			event.preventDefault();
			registration.submitLogin();

		});
	};

	return module;

})(registration || {});
