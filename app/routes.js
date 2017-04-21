const path = require('path')

module.exports.images = {
  etta: {
    color: path.resolve(__dirname, 'src', 'images', 'etta.jpg'),
    grey: path.resolve(__dirname, '../', 'generated', 'etta', 'grey.jpg')
  },
  granmoe: {
    color: path.resolve(__dirname, 'src', 'images', 'granmoe.png'),
    grey: path.resolve(__dirname, '../', 'generated', 'granmoe', 'grey.png')
  },
  pete: {
    color: path.resolve(__dirname, 'src', 'images', 'pete.png'),
    grey: path.resolve(__dirname, '../', 'generated', 'pete', 'grey.png')
  },
  hoff: {
    color: path.resolve(__dirname, 'src', 'images', 'hoff.png'),
    grey: path.resolve(__dirname, '../', 'generated', 'hoff', 'grey.png')
  }
}

module.exports.buildRatingPath = (user, rating, ext) => 
  path.resolve(__dirname, '../', 'generated', user, `${user}-${encodeURI(rating)}.${ext}`)