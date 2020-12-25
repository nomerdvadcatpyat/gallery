import { debounce, HtmlColumnsCreator } from './images-utils.js';

$(function() {

  const owner = window.location.pathname.split('/')[2];
  const htmlColumnsCreator = new HtmlColumnsCreator({ owner });

  // Загрузка первых 12 картинок
  htmlColumnsCreator.addPicsInColumns();

  // подгрузка картинок
  $(window).on('scroll', debounce(htmlColumnsCreator.populate, 500, htmlColumnsCreator));
})
