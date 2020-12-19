$(function() {

  $('#signUp-switch').on('click', () => $('.sign-in-container').addClass("right-panel-active"));
  $('#signIn-switch').on('click', () => $('.sign-in-container').removeClass("right-panel-active"));

  $(".modal-open").on('click', function(e){
    console.log(e);
    // $(document.body).css('overflow', 'hidden');
    $('.sign-in-container').addClass('is-open');
    $('.overlay-register-modal').css('display','flex');
  });

  $(document).on('click', function(e){
		if (!(
		($(e.target).parents('.sign-in-container').length) // (не) если мы кликнули точно по модалке
		||	($(e.target).hasClass('sign-in-container')) // и если мы кликаем не на форму
		||	($(e.target).hasClass('modal-open'))) // и если мы кликаем не на кнопку открытия формы
		) {
      $('.sign-in-container').removeClass('is-open');
      // $(document.body).css('overflow', 'auto');
      $('.overlay-register-modal').css('display','none');
		}
	});

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