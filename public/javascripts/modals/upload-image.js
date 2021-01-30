import { showErrorMessage, disableButton, enableButton } from './modals-utils.js'

// Окно загрузки картинки и загрузка картинок
$(function() {

  let imageFormInputFields = {};

  const clearForm = () => {
    $('.image-for-upload').remove();
    $('.upload-image-form__input-img-label').removeClass('has-file');
    $('.upload-image-form__file-name').html('Загрузить картинки');
    imageFormInputFields = {};
  }


  const sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];

  const showImagesForUpload = (imagesForUpload) => {
  const container = $('.images-for-upload');
   imagesForUpload.forEach((document, index) => {
    container.append(`
      <div class="image-for-upload images-for-upload__image">
        <p class="image-for-upload__filename"> 
          ${document.name} 
        </p>
        <div class="form__group field">
          <input id='alt-img${index}' class="image-for-upload__input form__field" type="text" placeholder="Введите описание картинки" />
          <label for="alt-img${index}" class="form__label"> Введите описание картинки </label>
        </div>
      </div>
    `);
   });
  }

  $('.upload-image-form__input-img').each(function() {
    const input = $(this),
        label = input.next('.upload-image-form__input-img-label'),
        labelVal = label.html();
     
    input.on('change', function(element) {
      clearForm();

      const files = $('.upload-image-form__input-img')[0].files;
      console.log(files);
      let fileName = '';
      // console.log(element.target.value);
      if (element.target.value) fileName = element.target.value.split('\\').pop();
      fileName ? 
        label.addClass('has-file').find('.upload-image-form__file-name')
          .html(`${sklonenie(files.length, ['Будет загружена', 'Будут загружены', 'Будет загружено'])} ${files.length} ${sklonenie(files.length, ['картинка', 'картинки', 'картинок'])}`) : 
        label.removeClass('has-file').html(labelVal);

        showImagesForUpload([...files]);
    });
  });

  $('.images-for-upload').on('input', (e) => {
    console.log($(e.target));
    const input = $(e.target);
    const fileName = input.parent().prev()[0].textContent.trim();
    if(input.hasClass('image-for-upload__input')) {
      console.log(e.target.value);
      imageFormInputFields[fileName] = e.target.value;
    }

    console.log(imageFormInputFields)
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
      clearForm();
      $('.upload-image-form').addClass('hidden');
      $('.modal-layout').addClass('hidden');
      // $(document.body).css('overflow','auto'); 
  })
  
  // upload
  $('#fileinfo').on('submit', function (e) {
    e.preventDefault();
    if($('.modal-button_inactive').length > 0) return;

    disableButton('.upload-image-form__submit', '/images/site-images/Rolling-1.3s-100px.gif');

    const formData = new FormData(this);
    // console.log(formData);

    formData.append('descriptions', JSON.stringify(imageFormInputFields));

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
        showErrorMessage('.upload-image-form__submit', data.error);
      } 
      else $(location).attr('href', '/');
      
      enableButton('.upload-image-form__submit');
    })
    .fail(err => console.log(err));
   });
   
});