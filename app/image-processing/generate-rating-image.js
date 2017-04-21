const fs = require('fs')
const Canvas = require('canvas')
const Image = Canvas.Image

function generateRatingImage (resolve, ratingPath, rating, colorBuf, greyBuf) {
  const colorImg = new Image()
  colorImg.src = colorBuf

  const greyImg = new Image()
  greyImg.src = greyBuf

  const fullWidth = colorImg.width * 5

  const ratingImg = new Canvas(fullWidth, colorImg.height)
  const ctx = ratingImg.getContext('2d')

  const colorPattern = ctx.createPattern(colorImg, 'repeat')
  const greyPattern = ctx.createPattern(greyImg, 'repeat')

  ctx.fillStyle = greyPattern
  ctx.fillRect(0, 0, fullWidth, colorImg.height)

  ctx.fillStyle = colorPattern
  ctx.fillRect(0, 0, colorImg.width * rating, colorImg.height)

  ratingImg.toBuffer((err, buf) => {
    fs.writeFile(ratingPath, buf, () => {
      resolve(buf)
    })
  })
}

function factory () {
  return new Promise(resolve => {
    generateRatingImage(resolve, ...arguments)
  })
}

module.exports = factory