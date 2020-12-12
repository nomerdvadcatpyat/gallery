$(function() {
  $('.sign-in-inner-container__submit').on('click', function(e) {
    e.preventDefault();
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
      console.log(data);
      if(!data.ok) {
        e.preventDefault();
        if($('.error-message').length == 0)
          $('.sign-in-inner-container__submit').after('<p class="error-message">' + data.error + '</p>');
        else $('.error-message').text(data.error);
        if(data.fields) 
          data.fields.forEach(item => { $(`.${item}`).addClass('error-field') })
      }
      else {
        $('.sign-in-inner-container__submit').after('<p class="success"> Сацес </p>');
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