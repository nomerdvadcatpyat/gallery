const sizeOf = require('image-size');
const path = require('path');
const config = require('../config');


class ColumnsGenerator {
  static getColumns(jsonImages, column1Height, column2Height, column3Height, posInColumn1, posInColumn2, posInColumn3) {
    const column1 = new Column(+column1Height);
    const column2 = new Column(+column2Height);
    const column3 = new Column(+column3Height);

    posInColumn1 = +posInColumn1 || 1;
    posInColumn2 = +posInColumn2 || 1;
    posInColumn3 = +posInColumn3 || 1;

    jsonImages.forEach( jsonPic => {
      console.log(jsonPic)
      const picHeight = sizeOf(path.join(__dirname, '..' , config.STATIC_DESTINATION, jsonPic.minImage)).height; // Почему то здесь он ожидает абсолютный путь
      switch(Column.getMinCloumn(column1, column2, column3)) {
        case column1:
          console.log('c1')
          column1.pics.push({ posInColumn: posInColumn1++ , fullImage: jsonPic.fullImage, minImage: jsonPic.minImage, alt: jsonPic.alt, owner: jsonPic.owner }); 
          column1.height += picHeight;
          break;

        case column2: 
          console.log('c2')
          column2.pics.push({ posInColumn: posInColumn2++, fullImage: jsonPic.fullImage, minImage: jsonPic.minImage, alt: jsonPic.alt, owner: jsonPic.owner });
          column2.height += picHeight; 
          break;
        
        case column3: 
          console.log('c3')
          column3.pics.push({ posInColumn: posInColumn3++, fullImage: jsonPic.fullImage, minImage: jsonPic.minImage, alt: jsonPic.alt, owner: jsonPic.owner });
          column3.height += picHeight;
          break;
      }
    });
    return { column1, column2, column3 };
  }
}

class Column {
  constructor(height) {
    this.pics = [],
    this.height = height || 0
  }

  static getMinCloumn(...columns) {
    return columns.sort((c1,c2) => c1.height - c2.height)[0];
  }
}


module.exports = ColumnsGenerator;