$(function() {
// смена иконки на кнопке загрузки картинки
  $('.input-img').each(function() {
    const input = $(this),
        label = input.next('.upload-image-label'),
        labelVal = label.html();
     
    input.on('change', function(element) {
      let fileName = '';
      console.log(element.target.value);
      if (element.target.value) fileName = element.target.value.split('\\').pop();
      fileName ? label.addClass('has-file').find('.file-name').html(fileName) : label.removeClass('has-file').html(labelVal);
    });
  });

  // открытие модалки загрузки картинки
  $('.upload-image').on('click', function(e) {
    if (!$('.upload-image').hasClass('non-active')) {
      $(document.body).css('overflow','hidden'); 
      $('.upload-image-form').addClass('is-upload-img-open');
    }
  });

  // закрытие модалки при клике на на нее
  $(document).on('click', function(e){
    console.log($(e.target).parents())
    if (!(($(e.target).parents('.upload-image-form').length)
        || $(e.target).hasClass('upload-image-form')
        || $(e.target).hasClass('upload-image'))) {
      $('.upload-image-form').removeClass('is-upload-img-open');
      $(document.body).css('overflow','auto'); 
		}
  });
  
  // upload
  $('#fileinfo').on('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    formData.set('alt', $('.img-description').val())
    console.log(formData);
    $.ajax({
      type: 'POST',
      url: '/upload/image',
      data: formData,
      processData: false,
      contentType: false,
      success: r => console.log(r),
      error: r => console.log(r)
    })
    .done(data => {
      if(data.ok) {
        $(location).attr('href', '/');
      }
    });
   });
   
});