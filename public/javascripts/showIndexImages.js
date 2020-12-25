import { debounce, HtmlColumnsCreator } from './images-utils.js';

$(function() {

  const htmlColumnsCreator = new HtmlColumnsCreator();

  // Загрузка первых 12 картинок
  htmlColumnsCreator.addPicsInColumns();

  // подгрузка картинок
  $(window).on('scroll', debounce(htmlColumnsCreator.populate, 500, htmlColumnsCreator));
})
