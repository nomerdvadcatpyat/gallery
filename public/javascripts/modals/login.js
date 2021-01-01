import { validateUser, disableButton, enableButton } from './modals-utils.js';

// Окно логина

$(function() {
  $('.sign-in-inner-container__submit').on('click', function(e) {
    e.preventDefault();

    disableButton('.sign-in-inner-container__submit', '/images/site-images/Rolling-1.1s-100px.gif');

    const user = {
      login: $('.sign-in-login').val(),
      pass: $('.sign-in-pass').val(),
    }
    
    console.log(user);
    $.ajax({
      type: "POST",
      data: JSON.stringify(user), 
      contentType: "application/json", 
      url: "/login"
    })
    .done(function (data) {
      validateUser( { e, container: '.sign-in-inner-container__submit', data, successMessage: 'Success' });
      enableButton('.sign-in-inner-container__submit');
    })
    .fail(function(err) {
      console.log(err);
    })
  });
});