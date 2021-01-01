

$(function() {
  // Открытие и переключение окна регистрации/логина
  $('#signUp-switch').on('click', () => $('.sign-in-container').addClass("right-panel-active"));
  $('#signIn-switch').on('click', () => $('.sign-in-container').removeClass("right-panel-active"));

  $(".header__sign-in-open-button").on('click', function(e){
    console.log(e);
    $('.modal-layout').removeClass('hidden');
		$('.sign-in-container').removeClass('hidden');
  });
  
  $('.modal-layout').on('click', function(e) {
    $('.sign-in-container').addClass('hidden');
    $('.modal-layout').addClass('hidden')
  })

  $('input').on('focus', function() {
    $('p.error-message').remove();
    $(this).removeClass('error-field');
  });
})

export function showErrorMessage(container, errorMessage) {
  if($('.error-message').length == 0)
    $(container).after('<p class="error-message">' + errorMessage + '</p>');
  else $('.error-message').text(errorMessage);
}

export function showSuccessMessage(container, successMessage) {
  $(container).after(`<p class="success"> ${successMessage} </p>`);
}

export function validateUser( { e, container, data, successMessage }) {
  console.log(data);
  if(!data.ok) {
    e.preventDefault();
    showErrorMessage(container, data.error);
    if(data.fields)
      data.fields.forEach(item => { $(`.${item}`).addClass('error-field') });
  }
  else {
    showSuccessMessage(container, successMessage);
    $(location).attr('href', '/');
  }
}

export function disableButton(button, loaderSrc) {
  $(button).removeClass('modal-button_active');
  $(button).addClass('modal-button_inactive');
  $('.error-message').remove();
  $(button).after(`<img class="modal-loader" src="${loaderSrc}" alt="round loader" />`);
}

export function enableButton(button) {
  $(button).removeClass('modal-button_inactive');
  $(button).addClass('modal-button_active');
  $('.modal-loader').remove();
}