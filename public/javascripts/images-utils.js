// Сюда надо вынести общую логику для индекс картинок и для картинок юзера

export class HtmlColumnsCreator {
  constructor(condtitonForDBreq) {
    // Для балансировки колонок
    this.col1Height = 0; 
    this.col2Height = 0;
    this.col3Height = 0;
    
    // Для перемещения по полноэкранной галерее
    this.column1Length = 0;
    this.column2Length = 0;
    this.column3Length = 0;

    // Для запросов к бд
    this.limit = 12;
    this.skip = 0;
    this.condtitonForDBreq = condtitonForDBreq || {}; // Используется для запроса по логину для профиля пользователя
    this.isEnd = false;
  }

  addPicsInColumns() {
    if(this.isEnd) return;

    $.ajax({
      beforeSend: function() {
        $('.content__loader').removeClass('hidden');
      },
      type: "GET",
      url: `/images?limit=${this.limit}&skip=${this.skip}&condition=${JSON.stringify(this.condtitonForDBreq)}`
    })
    .done(pics => {
      $('.content__loader').addClass('hidden')
      if(pics.length === 0) {
        this.isEnd = true;
        $('.content').append('<p class=content__end-text> Вы долистали до конца. </p>');
      }
      console.log(pics);
      pics.forEach(pic => {
        const minColumn = Math.min(this.col1Height, this.col2Height, this.col3Height);
        switch(minColumn) {
          case this.col1Height: {
            pic.posInColumn = ++this.column1Length;
            $('.column-1').append(this.getHtmlPic(pic, 1));
            this.col1Height += pic.minImageHeight;
            break;
          }
          case this.col2Height: {
            pic.posInColumn = ++this.column2Length;
            $('.column-2').append(this.getHtmlPic(pic, 2));
            this.col2Height += pic.minImageHeight;
            break;
          }
          case this.col3Height: {
            pic.posInColumn = ++this.column3Length;
            $('.column-3').append(this.getHtmlPic(pic, 3));
            this.col3Height += pic.minImageHeight;
            break;
          }
        }
      })
      
      this.skip += pics.length;
      this.updateColumnsData();
    })
    .fail(err => console.log(err));
  }

  populate() {
    // нижняя граница документа
    let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom;

    // если пользователь прокрутил достаточно далеко (< 100px до конца)
    if (windowRelativeBottom < document.documentElement.clientHeight + 100) {
      this.addPicsInColumns();
      this.updateColumnsData();
    }
  }

  getHtmlPic(pic, columnNum) {
    return $(`<section class="img-container" data-href=${pic.fullImage} data-column=${columnNum} data-col-position=${pic.posInColumn} tabindex="0">
                <img class="img-container__img" src=${pic.minImage} alt=${pic.alt}>
                <section class="img-container__info img-info">
                  <a class="img-info__link" href="/account/${pic.owner}">${pic.owner}</a>
                  <p class="img-info__text">${pic.alt}</p>
                </section>
              </section>`);
  }

  updateColumnsData() { 
    $('.content__columns').attr('data-col-3-length', this.column3Length);        
  }
}

export function debounce(fn, ms, context) {
  let timeout;
  return function () {
    const fnCall = () => { fn.apply(context, arguments) }
    clearTimeout(timeout); // clearTimeout от undefinded ничего не сделает
    timeout = setTimeout(fnCall, ms);
  }
}

