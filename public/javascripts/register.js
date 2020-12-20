$(function() {

  $('#signUp-switch').on('click', () => $('.sign-in-container').addClass("right-panel-active"));
  $('#signIn-switch').on('click', () => $('.sign-in-container').removeClass("right-panel-active"));

  $(".header__sign-in-open-button").on('click', function(e){
    console.log(e);
    // $(document.body).css('overflow', 'hidden');
    $('.modal-layout').removeClass('hidden');
		$('.sign-in-container').removeClass('hidden');
  });
  
  $('.modal-layout').on('click', function(e) {
    $('.sign-in-container').addClass('hidden');
    $('.modal-layout').addClass('hidden')
    // $(document.body).css('overflow','auto'); 
})

  // Отправка данных с формы по нажатию на submit
  $('.sign-up-inner-container__submit').on('click', function(e) {
    e.preventDefault();
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
      console.log(data);
      if(!data.ok) {
        if($('.error-message').length == 0)
          $('.sign-up-inner-container__submit').after('<p class="error-message">' + data.error + '</p>');
        else $('.error-message').text(data.error);
        if(data.fields) 
          data.fields.forEach(item => { $(`.${item}`).addClass('error-field') })
      }
      else {
         $('.sign-up-inner-container__submit').after('<p class="success"> Регистрация прошла успешно </p>');
         $(location).attr('href', '/');
      }
    })
    .fail(function(err) {
      console.log(err);
    })
  });

  $('input').on('focus', function() {
    $('p.error-message').remove();
    $(this).removeClass('error-field');
  });
})