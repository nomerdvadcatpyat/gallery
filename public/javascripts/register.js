$(function() {
  $('.submit').on('click', function(e) {
    e.preventDefault();
    const user = {
      login: $('.login').val(),
      pass: $('.pass').val(),
      rePass: $('.rePass').val() 
    }
    
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
          $('.register-form').after('<p class="error-message">' + data.error + '</p>');
        else $('.error-message').text(data.error);
        if(data.fields) {
          data.fields.forEach(item => {
              $(`.${item}`).addClass('error-field')
          })
        }
      }
      else {
        $('.register-form').after('<p class="success"> Регистрация прошла успешно </p>');
      }
    })
    .fail(function(err) {
      console.log(err);
    })
  });

  $('input').on('focus', function() {
    $('p.error-message').remove();
    $(this).removeClass('error-field');
  })
})