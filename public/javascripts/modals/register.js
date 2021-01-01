import { validateUser, disableButton, enableButton } from './modals-utils.js';

// Окно регистрации

$(function() {

  // Отправка данных с формы по нажатию на submit
  $('.sign-up-inner-container__submit').on('click', function(e) {
    e.preventDefault();

    disableButton('.sign-up-inner-container__submit', '/images/site-images/Rolling-1.1s-100px.gif');

    const user = {
      login: $('.login').val(),
      pass: $('.pass').val(),
      rePass: $('.rePass').val() 
    }
    
    console.log(user);
    $.ajax({
      type: "POST",
      data: JSON.stringify(user), 
      contentType: "application/json", 
      url: "/register"
    })
    .done(function (data) {
      validateUser( { e, container: '.sign-up-inner-container__submit', data, successMessage: 'Регистрация прошла успешно' });
      enableButton('.sign-up-inner-container__submit');
    })
    .fail(function(err) {
      console.log(err);
    })
  });
});