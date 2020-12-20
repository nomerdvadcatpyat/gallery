$(function() {
// смена иконки на кнопке загрузки картинки
  $('.upload-image-form__input-img').each(function() {
    const input = $(this),
        label = input.next('.upload-image-form__input-img-label'),
        labelVal = label.html();
     
    input.on('change', function(element) {
      let fileName = '';
      // console.log(element.target.value);
      if (element.target.value) fileName = element.target.value.split('\\').pop();
      fileName ? label.addClass('has-file').find('.upload-image-form__file-name').html(fileName) : label.removeClass('has-file').html(labelVal);
    });
  });

  // открытие модалки загрузки картинки
  $('.header__upload-image-button').on('click', function(e) {
    if (!$('.header__upload-image-button').hasClass('non-active')) {
      // $(document.body).css('overflow','hidden'); 
      $('.modal-layout').removeClass('hidden');
      $('.upload-image-form').removeClass('hidden');
    }
  });

  $('.modal-layout').on('click', function(e) {
      $('.upload-image-form').addClass('hidden');
      $('.modal-layout').addClass('hidden')
      // $(document.body).css('overflow','auto'); 
  })
  
  // upload
  $('#fileinfo').on('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    formData.set('alt', $('.upload-image-form__img-description').val())
    // console.log(formData);
    $.ajax({
      type: 'POST',
      url: '/upload/image',
      data: formData,
      processData: false,
      contentType: false,
    })
    .done(data => {
      console.log(data);

      if(!data.ok) {
        if($('.error-message').length == 0)
          $('.upload-image-form__upload-img-button').after('<p class="error-message">' + data.error + '</p>');
        else $('.error-message').text(data.error);
      } 
      else $(location).attr('href', '/');
      
    })
    .fail(err => console.log(err));
   });
   
});