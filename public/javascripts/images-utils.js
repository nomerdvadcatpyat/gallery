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
let lastSkip;
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

export async function addPicsInColumns(owner) {
    if(isEnd) return false;

    if(lastSkip === skip) return;// Если интернет медленный, может приходить много одинаковых запросов
    lastSkip = skip;

    if(!galleryOwner) // Если еще не установили владельца галереи (Если это не индекс пейдж)
      galleryOwner = owner ? {owner} : {};
    
    return new Promise((resolve, reject) => {
      $.ajax({
        beforeSend: function() {
          $('.content__loader').removeClass('hidden');
        },
        type: "GET",
        url: `/images?limit=${limit}&skip=${skip}&condition=${JSON.stringify(galleryOwner)}`
      })
      .done(pics => {
        console.log('ajax done');
        $('.content__loader').addClass('hidden')
        if(pics.length === 0) {
          isEnd = true;
          $('.content').append('<p class=content__end-text> Вы долистали до конца. </p>');
          resolve(false);
        }

        allPics.push(...pics); // Добавляем пришедшие жсоны картинок в массив для балансировки колонок при переходе между мобильным и десктопным режимом

        if(isMobile) createMobileColumn(pics);
        else createThreeColumns(pics);
        
        skip += pics.length;
        resolve(true);
      })
      .fail(err => {
        console.log(err);
        reject(err);
      });
    });
  }


function getHtmlPic(pic, columnNum) {
    return $(`<section class="img-container img-container_non-active ${isMobile ? 'mobile-pic' : 'desktop-pic'}" data-href=${pic.fullImage} data-column=${columnNum} data-col-position=${pic.posInColumn} tabindex="-1">
                <img class="img-container__img img-container__img_preload" src="/images/site-images/Blocks-1s-300px.gif" data-src=${pic.minImage} alt=${pic.alt}>
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
    appendPic(pic, 3);
  });
}

function createThreeColumns(pics) {
    $('.mobile-pic').remove();

    pics.forEach(pic => {
      const minColumn = Math.min(col1Height, col2Height, col3Height);
      switch(minColumn) {
        case col1Height: {
          pic.posInColumn = ++column1Length;
          appendPic(pic, 1);
          col1Height += pic.minImageHeight;
          break;
        }
        case col2Height: {
          pic.posInColumn = ++column2Length;
          appendPic(pic, 2);
          col2Height += pic.minImageHeight;
          break;
        }
        case col3Height: {
          pic.posInColumn = ++column3Length;
          appendPic(pic, 3);
          col3Height += pic.minImageHeight;
          break;
        }
      }
    });
  }

function appendPic(jsonPic, columnNum) {
  const htmlPicContainer = getHtmlPic(jsonPic, columnNum);
  $(`.column-${columnNum}`).append(htmlPicContainer);

  const pic = htmlPicContainer.children('.img-container__img');
  const src = pic.attr('data-src');
  
  let newImg = new Image();
  newImg.onload = function(){
    $(htmlPicContainer).removeClass('img-container_non-active');
    $(htmlPicContainer).addClass('img-container_active');
    $(pic).removeClass('img-container__img_preload');
    $(pic).addClass('img-container__img_loaded');
    $(pic).attr('src', src)
  }
  newImg.src = src;
}

export function throttle (func, ms) {
  let isThrottled = false;
  let savedArgs;
  let savedThis;
  
  function wrapper() {
    if (isThrottled) {
      savedArgs = arguments;
      savedThis = this;
      return;
    }
    func.apply(this, arguments);
    isThrottled = true;
    setTimeout(function() {
      isThrottled = false;
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs);
        savedArgs = savedThis = null;
      }      
    }, ms);
  }
  return wrapper;
}

