import { isMobile, throttle, addPicsInColumns } from './images-utils.js';

let currentColumn;
let currentRow;

let isFullScreenGallery = () => $('.full-img-layout__image').length !== 0 ||  $('.full-img-layout__image-loader').length !== 0;

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


  const showImage = (href, reqRow, reqColumn) => {
    $('.full-img-layout').append(`<img class="full-img-layout__image-loader" src="/images/site-images/Blocks-1s-300px.gif">`);

    let newImg = new Image();
    newImg.onload = function(){
      if(isFullScreenGallery()) {
        // Если пользователь будет быстро скроллить полнэкранную галерею, то покажется только последняя картинка
        if(reqRow === currentRow && reqColumn === currentColumn) {
          $('.full-img-layout__image-loader').remove();
          $('.full-img-layout').append(`<img class="full-img-layout__image" src=${href}>`);
        }
      }
    }
    newImg.src = href;

    if((currentColumn === 1 || isMobile) && currentRow === 1) $('.full-img-layout__arrow-left').addClass('hidden');
    else $('.full-img-layout__arrow-left').removeClass('hidden');
  }



  // Делегирование клика на контейнер картинки
  $('.content__columns').on('click', function(e) {
    if($(e.target).parent().attr('class').includes('img-container_active')) {
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
      showImage(href, currentRow, currentColumn);
      loadNextImage();
    }
  })

  $('.full-img-layout').on('click', function (e) {
    const targetClass = $(e.target).attr('class');
    if(!targetClass.includes('full-img-layout__arrow-left') && !targetClass.includes('full-img-layout__arrow-right') && !targetClass.includes('full-img-layout__image')) {
      closeFullImageGallery();
    }
  })


  // Различные перемещения по полноэкранной галерее

  $('.full-img-layout__arrow-right').on('click', () => showNextFullImage());
  $('.full-img-layout__arrow-left').on('click', () => showPreviousFullImage());

  $(window).on('keydown', (e) => {
    if(isFullScreenGallery()) {
      if(e.code === "ArrowRight") showNextFullImage();
      else if (e.code === "ArrowLeft") showPreviousFullImage();
      else if (e.code === "Escape") closeFullImageGallery();
    }
  });

  $(window).on('wheel', function(e){
    if(isFullScreenGallery()) { 

      if(e.originalEvent.deltaY > 0) showNextFullImage();
      else showPreviousFullImage();
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



  // Следующая и предыдущая полноэкранные картинки

  const showNextFullImage = async () => {
    $('.full-img-layout__image').remove();
    $('.full-img-layout__image-loader').remove();

    const newPos = await getNextPosition();
    currentRow = newPos.row;
    currentColumn = newPos.column;

    const href = $(`.img-container[data-column=${currentColumn}][data-col-position=${currentRow}]`).data('href');
    showImage(href, currentRow, currentColumn);
    loadNextImage();
  } 


  const loadNextImage = async () => {
    const nextPosition = await getNextPosition();
    const nextImageHref = $(`.img-container[data-column=${nextPosition.column}][data-col-position=${nextPosition.row}]`).data('href');
    new Image().src = nextImageHref;
  }

  const getNextPosition = async () => {
    const res = {
      row: currentRow,
      column: currentColumn
    }

    if(isMobile) {
      res.column = 3;
      if($(`.img-container[data-column=3][data-col-position=${currentRow + 1}]`).length === 0) {
        const isNewImagesFounded = await addPicsInColumns();
        if(isNewImagesFounded) {
          return getNextPosition();
        }
        else res.row = 1;
      }
      else res.row = currentRow + 1;
    }
    else {
      // Проверка элементов в текущей строке
      const nextElemInCurrentRow = getNextPosInCurrentRow();
      if(nextElemInCurrentRow) 
        res.column = nextElemInCurrentRow;
      else {
        // Проверка следующей строки или переход на (0,0)
        const nextElemInNextRow = getNextPosInNextRow();
        if(nextElemInNextRow) {
          res.row = currentRow + 1;
          res.column = nextElemInNextRow;
        }
        else {
          const isNewImagesFounded = await addPicsInColumns();
          if(isNewImagesFounded) {
            return getNextPosition();
          }
          else {
            res.row = 1;
            res.column = 1;
          }
        }
      }
    }

    return res;
  }

  const getNextPosInCurrentRow = () => {
    if(currentColumn === 1) {
      if($(`.img-container[data-column=2][data-col-position=${currentRow}]`).length !== 0) {
        return 2;
      }
      if($(`.img-container[data-column=3][data-col-position=${currentRow}]`).length !== 0) {
        return 3;
      }
    }
    if(currentColumn === 2) {
      if($(`.img-container[data-column=3][data-col-position=${currentRow}]`).length !== 0) {
        return 3;
      }
    }
  }

  const getNextPosInNextRow = () => {
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



  const showPreviousFullImage = () => {
    $('.full-img-layout__image').remove();
    $('.full-img-layout__image-loader').remove();

    const previousPosition = getPreviousPosition();
    currentRow = previousPosition.row;
    currentColumn = previousPosition.column;

    const href = $(`.img-container[data-column=${currentColumn}][data-col-position=${currentRow}]`).data('href');
    showImage(href, currentRow, currentColumn);
  }

  const getPreviousPosition = () => {
    const res = {
      row: currentRow,
      column: currentColumn
    }

    if(isMobile) {
      res.column = 3;
      if(currentRow !== 1) res.row = currentRow - 1;
    }
    else {
      const previousElem = getPreviousPosInCurrentRow();
      if(previousElem) 
        res.column = previousElem;
      else {
        const prevRowElem = getPreviousPosInPreviousRow();
        if(prevRowElem) {
          res.row = currentRow - 1;
          res.column = prevRowElem;
        }
      }
    }
    return res;
  }

  const getPreviousPosInCurrentRow = () => {
    if(currentColumn === 3) {
      if($(`.img-container[data-column=2][data-col-position=${currentRow}]`).length !== 0) {
        return 2;
      }
      if($(`.img-container[data-column=1][data-col-position=${currentRow}]`).length !== 0) {
        return 1;
      }
    }
    else if(currentColumn === 2) {
      if($(`.img-container[data-column=1][data-col-position=${currentRow}]`).length !== 0) {
        return 1;
      }
    }
  }

  const getPreviousPosInPreviousRow = () => {
    if($(`.img-container[data-column=3][data-col-position=${currentRow - 1}]`).length !== 0) {
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







