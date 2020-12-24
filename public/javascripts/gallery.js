let allCount = +$('.content__columns').data('allCount');
let col1Length = +$('.content__columns').data('col-1Length');;
let col2Length = +$('.content__columns').data('col-2Length');
let col3Length = +$('.content__columns').data('col-3Length');
let col1Height = +$('.content__columns').data('col-1Height');;
let col2Height = +$('.content__columns').data('col-2Height');
let col3Height = +$('.content__columns').data('col-3Height');

let currentColumn;
let currentRow;

console.log(+$('.content__columns').data('col-3Height'))

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
        currentRow = col3Length;
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


  // подгрузка изображений

  $(window).on('scroll', debounce(populate, 500))

  function populate() {
    // нижняя граница документа
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;
  
    // если пользователь прокрутил достаточно далеко (< 100px до конца)
    if (windowRelativeBottom < document.documentElement.clientHeight + 100) {
      const columns = $('.content__columns');
      const col1Height = columns.data('col-1Height');
      const col2Height = columns.data('col-2Height');
      const col3Height = columns.data('col-3Height');
      console.log('ajax', columns.attr('data-all-count'));
      $.ajax({
        method: "POST",
        url: "/columns",
        data: { col1Height, col2Height, col3Height, col1Length, col2Length, col3Length, count: columns.attr('data-all-count') }
      })
      .done(columns => {
        if(columns.column1.pics.length === 0 && columns.column2.pics.length === 0 && columns.column3.pics.length === 0) return;
        updateDataFields(columns);
        columns.column1.pics.forEach(pic => {
          console.log(pic);
          const htmlPic = getHtmlPic(pic, 1);
          $('.column-1').append(htmlPic);
        });
        columns.column2.pics.forEach(pic => {
          const htmlPic = getHtmlPic(pic, 2);
          $('.column-2').append(htmlPic);
        });
        columns.column3.pics.forEach(pic => {
          const htmlPic = getHtmlPic(pic, 3);
          $('.column-3').append(htmlPic);
        });  
      })
      .fail(err => console.log(err));   
    }
  }

  function getHtmlPic(pic, columnNum) {
    return $(`<section class="img-container" data-href=${pic.fullImage} data-column=${columnNum} data-col-position=${pic.posInColumn} tabindex="0">
                <img class="img-container__img" src=${pic.minImage} alt=${pic.alt}>
                <section class="img-container__info img-info">
                  <a class="img-info__link" href="/account/${pic.owner}">${pic.owner}</a>
                  <p class="img-info__text">${pic.alt}</p>
                </section>
              </section>`);
  }

  function updateDataFields(columns) {
    console.log(columns)
    allCount += columns.column1.pics.length + columns.column2.pics.length + columns.column3.pics.length;
    $('.content__columns').attr('data-all-count', allCount);
    col1Length += columns.column1.pics.length;
    $('.content__columns').attr('data-col-1-length', col1Length);
    col1Height += columns.column1.height;
    $('.content__columns').attr('data-col-1-height', col1Height);
    col2Length += columns.column2.pics.length;
    $('.content__columns').attr('data-col-2-length', col2Length);
    col2Height += columns.column2.height;
    $('.content__columns').attr('data-col-2-height', col3Height);
    col3Length += columns.column3.pics.length;
    $('.content__columns').attr('data-col-3-length', col3Length);
    col3Height += columns.column3.height;
    $('.content__columns').attr('data-col-3-height', col3Height);    
  }
  
  function debounce(fn, ms) {
    let timeout;
    return function () {
      const fnCall = () => { fn.apply(this, arguments) }
      clearTimeout(timeout); // clearTimeout от undefinded ничего не сделает
      timeout = setTimeout(fnCall, ms);
    }
  }
})







