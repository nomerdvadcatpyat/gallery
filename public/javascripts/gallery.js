import { isMobile, throttle, addPicsInColumns } from './images-utils.js';

let currentColumn;
let currentRow;

let isFullScreenGallery = () => $('.full-img-layout__image').length !== 0;

$(function() {
  
  // Загрузка первых 12 картинок
  let owner;
  if(window.location.pathname.includes('account'))
    owner = window.location.pathname.split('/')[2];
    
  addPicsInColumns(owner);

  // подгрузка картинок, в неполноэкранной галерее
  $(window).on('scroll', throttle(() => {
    if(!isFullScreenGallery()) {
      let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
      // если пользователь прокрутил достаточно далеко (< 100px до конца)
      if (windowRelativeBottom < document.documentElement.clientHeight + 100)       
        addPicsInColumns();
    }
  }, 300));


  const showImage = href => {
    console.log('append', href)
    $('.full-img-layout').append(`<img class="full-img-layout__image" src="/images/site-images/Blocks-1s-300px.gif">`);

    let newImg = new Image();
    newImg.onload = function(){
      $('.full-img-layout__image').remove();
      $('.full-img-layout').append(`<img class="full-img-layout__image" src=${href}>`);
    }
    newImg.src = href;

    if((currentColumn === 1 || isMobile) && currentRow === 1) $('.full-img-layout__arrow-left').addClass('hidden');
    else $('.full-img-layout__arrow-left').removeClass('hidden');
  }

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

      // console.log('oncklick col row', currentColumn, currentRow);
      // console.log('onclick href', href);

      openFullImageGallery();
      showImage(href);
    }
  })

  $('.full-img-layout').on('click', function (e) {
    // console.log(e.target)
    const targetClass = $(e.target).attr('class');
    // console.log($(e.target).attr('class'));
    if(!targetClass.includes('full-img-layout__arrow-left') && !targetClass.includes('full-img-layout__arrow-right') && !targetClass.includes('full-img-layout__image')) {
      closeFullImageGallery();
    }
  })


  // Различные перемещения по полноэкранной галерее

  $('.full-img-layout__arrow-right').on('click', () => nextImage());
  $('.full-img-layout__arrow-left').on('click', () => previousImage());

  $(window).on('keydown', (e) => {
    console.log(e.code);
    if(isFullScreenGallery()) {
      if(e.code === "ArrowRight") nextImage();
      else if (e.code === "ArrowLeft") previousImage();
      else if (e.code === "Escape") closeFullImageGallery();
    }
  });

  $(window).on('wheel', function(e){
    console.log($('.full-img-layout__image'))
    console.log(e);
    if(isFullScreenGallery()) { 
      console.log('in mousewheel')
      if(e.originalEvent.deltaY > 0) nextImage();
      else previousImage();
    }
  });

  const openFullImageGallery = () => {
    $('.full-img-layout').removeClass('hidden');
    $('body').css('overflow','hidden');
  }
  
  const closeFullImageGallery = () => {
    $('.full-img-layout__image').remove();
    $('.full-img-layout').addClass('hidden');
    $('body').css('overflow','auto');
  }

  const nextImage = async () => {
    $('.full-img-layout__image').remove();
    console.log('oldCol', currentColumn);
    console.log('oldRow', currentRow);

    if(isMobile) {
      currentColumn = 3;
      if($(`.img-container[data-column=3][data-col-position=${currentRow + 1}]`).length === 0) {
        const isNewImagesFounded = await addPicsInColumns();
        console.log('isNewImagesFounded', isNewImagesFounded);
        if(isNewImagesFounded) {
          nextImage();
          return;
        }
        else currentRow = 1;
      }
      else currentRow++;
    }
    else {
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
          const isNewImagesFounded = await addPicsInColumns();
          console.log('isNewImagesFounded', isNewImagesFounded);
          if(isNewImagesFounded) {
            nextImage();
            return;
          }
          else {
            currentRow = 1;
            currentColumn = 1;
          }
        }
      }
    }
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
    $('.full-img-layout__image').remove();

    if(isMobile) {
      currentColumn = 3;
      if(currentRow !== 1) currentRow--;
    }
    else {
      const previousElem = checkPrevInCurrentRow();
      if(previousElem) 
        currentColumn = previousElem;
      else {
        const prevRowElem = checkPrevRow();
        if(prevRowElem) {
          currentRow--;
          currentColumn = prevRowElem;
        }
      }
    }
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
});







