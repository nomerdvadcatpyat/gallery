let current = -1;
let lastImageID;

$(function() {
  const showImage = href => $('.full-img-pic-layout').append(`<img class="full-img" src=${href}>`);

  $('.full-image-link').on('click', function(e) {
    e.preventDefault();

    // $('.full-img-pic-layout').append('<img src="/images/site-images/arrow-left.png" class="arrow-left">');
    // $('.full-img-pic-layout').append('<img src="/images/site-images/arrow-right.png" class="arrow-right">');

    current = +$(this).attr('id');
    const href = $(this).data('href');
    lastImageID = +$('.content').data('allCount') - 1;
    
    $('.full-img-pic-layout').removeClass('hidden');
    $('body').css('overflow','hidden');

    showImage(href);
  })

  $('.full-img-pic-layout').on('click', function (e) {
    console.log(e.target)
    const targetClass = $(e.target).attr('class');
    if(targetClass !== 'arrow-left' && targetClass !== 'arrow-right' && targetClass !== 'full-img') {
      console.log(targetClass);
      console.log($(e.target).attr('class'));
      $('.full-img').remove();
      $('.full-img-pic-layout').addClass('hidden');
      $('body').css('overflow','auto');
    }
  })

  $('.arrow-right').on('click', (e) => nextImage());
  $('.arrow-left').on('click', (e) => previousImage());

  $(document).on('keydown', (e) => {
    if($('.full-img')) {
      if(e.code === "ArrowRight") nextImage();
      else if (e.code === "ArrowLeft") previousImage();
    }
  })

  const nextImage = () => {
    $('.full-img').remove();
    current = current === lastImageID ? 0 : ++current;
    const href = $(`#${current}`).data('href');
    showImage(href);
  } 
  
  const previousImage = () => {
    $('.full-img').remove();
    current = current === 0 ? lastImageID : --current;
    const href = $(`#${current}`).data('href');
    showImage(href);
  }
})