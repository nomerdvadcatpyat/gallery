let currentColumn;
let currentRow;

$(function() {
  const showImage = href => $('.full-img-pic-layout').append(`<img class="full-img" src=${href}>`);

  // Делегирование клика на контейнер картинки
  $('.content__columns').on('click', function(e) {
    if($(e.target).parent().attr('class').includes('img-container')) {
      let pic = $(e.target).parent();
      // Если кликнули не по img-container, а по ссылке на профиль или на описание картинки
      if($(e.target).attr('class').includes('img-info__link')) return;
      if($(e.target).attr('class').includes('img-info__text'))
        pic = pic.parent();

      e.preventDefault();

      const href = $(pic).data('href');
      currentColumn = +$(pic).data('column');
      currentRow = +$(pic).data('colPosition');

      openFullImageGallery();
      showImage(href);
    }
  })

  $('.full-img-pic-layout').on('click', function (e) {
    console.log(e.target)
    const targetClass = $(e.target).attr('class');
    if(targetClass !== 'full-img-pic-layout__arrow-left' && targetClass !== 'full-img-pic-layout__arrow-right' && targetClass !== 'full-img') {
      console.log($(e.target).attr('class'));
      closeFullImageGallery();
    }
  })

  $('.full-img-pic-layout__arrow-right').on('click', (e) => nextImage());
  $('.full-img-pic-layout__arrow-left').on('click', (e) => previousImage());

  $(document).on('keydown', (e) => {
    console.log(e.code);
    if($('.full-img')) {
      if(e.code === "ArrowRight") nextImage();
      else if (e.code === "ArrowLeft") previousImage();
      else if (e.code === "Escape") closeFullImageGallery();
    }
  })

  const openFullImageGallery = () => {
    $('.full-img-pic-layout').removeClass('hidden');
    $('body').css('overflow','hidden');

  }
  
  const closeFullImageGallery = () => {
    $('.full-img').remove();
    $('.full-img-pic-layout').addClass('hidden');
    $('body').css('overflow','auto');
  }

  const nextImage = () => {
    $('.full-img').remove();

    // Проверка элементов в текущей строке
    const nextElemInCurrentRow = checkNextInCurrentRow();
    if(nextElemInCurrentRow) 
      currentColumn = nextElemInCurrentRow;
    else {
      // Проверка следующей строки или переход на (0,0)
      const nextElemInNextRow = checkNextRow();
      if(nextElemInNextRow) {
        currentRow++;
        currentColumn = nextElemInNextRow;
      }
      else {
        currentRow = 1;
        currentColumn = 1;
      }
    }
    console.log('out next curCol', currentColumn);
    console.log('out next curPos', currentRow);

    const href = $(`.img-container[data-column=${currentColumn}][data-col-position=${currentRow}]`).data('href');
    showImage(href);
  } 

  const checkNextInCurrentRow = () => {
    if(currentColumn === 1) {
      if($(`.img-container[data-column=2][data-col-position=${currentRow}]`).length !== 0) {
        return 2;
      }
      else if($(`.img-container[data-column=3][data-col-position=${currentRow}]`).length !== 0) {
        return 3;
      }
    }
    else if(currentColumn === 2) {
      if($(`.img-container[data-column=3][data-col-position=${currentRow}]`).length !== 0) {
        return 3;
      }
    }
  }

  const checkNextRow = () => {
    console.log('checkNextRow');
    if($(`.img-container[data-column=1][data-col-position=${currentRow + 1}]`).length !== 0) {
      console.log($(`.img-container[data-column=1][data-col-position=${currentRow + 1}]`).length !== 0)
      console.log('return 1')
      return 1;
    }
    if($(`.img-container[data-column=2][data-col-position=${currentRow + 1}]`).length !== 0) {
      return 2;
    }
    if($(`.img-container[data-column=3][data-col-position=${currentRow + 1}]`).length !== 0) {
      return 3;
    }
  }


  const previousImage = () => {
    $('.full-img').remove();

    const previousElem = checkPrevInCurrentRow();
    if(previousElem) 
      currentColumn = previousElem;
    else {
      const prevRowElem = checkPrevRow();
      if(prevRowElem) {
        currentRow--;
        currentColumn = prevRowElem;
      }
      else {
        currentRow = +$('.content__columns').attr('data-col-3-length');
        currentColumn = 3;
      }
    }
    
    console.log('out next curCol', currentColumn);
    console.log('out next curPos', currentRow);

    const href = $(`.img-container[data-column=${currentColumn}][data-col-position=${currentRow}]`).data('href');
    showImage(href);
  }

  const checkPrevInCurrentRow = () => {
    if(currentColumn === 3) {
      if($(`.img-container[data-column=2][data-col-position=${currentRow}]`).length !== 0) {
        return 2;
      }
      else if($(`.img-container[data-column=1][data-col-position=${currentRow}]`).length !== 0) {
        return 1;
      }
    }
    else if(currentColumn === 2) {
      if($(`.img-container[data-column=1][data-col-position=${currentRow}]`).length !== 0) {
        return 1;
      }
    }
  }

  const checkPrevRow = () => {
    console.log('checkPrevRow');
    if($(`.img-container[data-column=3][data-col-position=${currentRow - 1}]`).length !== 0) {
      console.log('return 3')
      return 3;
    }
    if($(`.img-container[data-column=2][data-col-position=${currentRow - 1}]`).length !== 0) {
      return 2;
    }
    if($(`.img-container[data-column=1][data-col-position=${currentRow - 1}]`).length !== 0) {
      return 1;
    }
  }
})







