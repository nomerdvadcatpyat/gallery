let allPics = []; // жсоны картинок
export let isMobile = $(window).width() <= 700 ? true : false;
// Для балансировки колонок
let col1Height = 0; 
let col2Height = 0;
let col3Height = 0;
// Для перемещения по полноэкранной галерее
export let column1Length = 0;
export let column2Length = 0;
export let column3Length = 0;
export let mobileColumnLength = 0;
// Для запросов к бд
let limit = 12;
let skip = 0;
let isEnd = false;
let galleryOwner;

let oldWidth = $(window).width();
$(function() {
  $(window).on('resize', function() { // Переход между мобильным и десктопным режимом.
    if ($(window).width() <= 700 && oldWidth > 700 || $(window).width() > 700 && oldWidth <= 700) {
      // При переходе обнуляем все значения построенных колонок и строим заново
      column1Length = 0;
      column2Length = 0;
      column3Length = 0;
      col1Height = 0; 
      col2Height = 0;
      col3Height = 0;
      mobileColumnLength = 0;
      if($(window).width() <= 700 && oldWidth > 700) {
        isMobile = true;
        createMobileColumn(allPics);
      }
      else {
        isMobile = false;
        createThreeColumns(allPics);
      }
    } 
    oldWidth = $(window).width();
  });
});

export function addPicsInColumns(owner) {
    if(isEnd) return;

    if(!galleryOwner) // Если еще не установили владельца галереи (Если это не индекс пейдж)
      galleryOwner = owner ? {owner} : {};
    
    $.ajax({
      beforeSend: function() {
        $('.content__loader').removeClass('hidden');
      },
      type: "GET",
      url: `/images?limit=${limit}&skip=${skip}&condition=${JSON.stringify(galleryOwner)}`
    })
    .done(pics => {
      $('.content__loader').addClass('hidden')
      if(pics.length === 0) {
        isEnd = true;
        $('.content').append('<p class=content__end-text> Вы долистали до конца. </p>');
      }

      allPics.push(...pics); // Добавляем пришедшие жсоны картинок в массив для балансировки колонок при переходе между мобильным и десктопным режимом

      if(isMobile) createMobileColumn(pics);
      else createThreeColumns(pics);
      
      skip += pics.length;
    })
    .fail(err => console.log(err));
  }

export function populate() {
    // нижняя граница документа
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;

    // если пользователь прокрутил достаточно далеко (< 100px до конца)
    if (windowRelativeBottom < document.documentElement.clientHeight + 100) {
      addPicsInColumns();
    }
  }

function getHtmlPic(pic, columnNum) {
    return $(`<section class="img-container ${isMobile ? 'mobile-pic' : 'desktop-pic'}" data-href=${pic.fullImage} data-column=${columnNum} data-col-position=${pic.posInColumn} tabindex="0">
                <img class="img-container__img" src=${pic.minImage} alt=${pic.alt}>
                <section class="img-container__info img-info">
                  <a class="img-info__link" href="/account/${pic.owner}">${pic.owner}</a>
                  <p class="img-info__text">${pic.alt}</p>
                </section>
              </section>`);
}

function createMobileColumn(pics) {
  $('.desktop-pic').remove();

  pics.forEach(pic => {
    pic.posInColumn = ++mobileColumnLength;
    $('.column-3').append(getHtmlPic(pic, 3, true));
  });
}

function createThreeColumns(pics) {
    $('.mobile-pic').remove();

    pics.forEach(pic => {
      const minColumn = Math.min(col1Height, col2Height, col3Height);
      console.log(minColumn, col1Height, col2Height, col3Height)
      switch(minColumn) {
        case col1Height: {
          pic.posInColumn = ++column1Length;
          $('.column-1').append(getHtmlPic(pic, 1));
          col1Height += pic.minImageHeight;
          break;
        }
        case col2Height: {
          pic.posInColumn = ++column2Length;
          $('.column-2').append(getHtmlPic(pic, 2));
          col2Height += pic.minImageHeight;
          break;
        }
        case col3Height: {
          pic.posInColumn = ++column3Length;
          $('.column-3').append(getHtmlPic(pic, 3));
          col3Height += pic.minImageHeight;
          break;
        }
      }
    });
  }

export function debounce(fn, ms) {
  let timeout;
  return function () {
    const fnCall = () => { fn.apply(this, arguments) }
    clearTimeout(timeout); // clearTimeout от undefinded ничего не сделает
    timeout = setTimeout(fnCall, ms);
  }
}

