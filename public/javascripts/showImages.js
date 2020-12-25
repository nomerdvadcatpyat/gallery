import { debounce, addPicsInColumns, populate } from './images-utils.js';

$(function() {
  // Загрузка первых 12 картинок
  let owner;
  if(window.location.pathname.includes('account'))
    owner = window.location.pathname.split('/')[2];
    
  addPicsInColumns(owner);

  // подгрузка картинок
  $(window).on('scroll', debounce(populate, 500));
})
