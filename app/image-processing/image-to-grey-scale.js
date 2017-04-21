const Canvas = require('canvas')
const Image = Canvas.Image
const convert = require('color-convert')
const fs = require('fs')

const fetchOrMake = require('../fetch-or-make')

function toGreyScale (resolve, imgPath, imgData) {
  // original image
  const granmoePNG = new Image()
  granmoePNG.src = imgData

  // make a grey scale copy
  const greyCanvas = new Canvas(granmoePNG.width, granmoePNG.height)
  const greyCtx = greyCanvas.getContext('2d')

  greyCtx.drawImage(granmoePNG, 0, 0, granmoePNG.width, granmoePNG.height)

  for (var y = 0; y <= granmoePNG.height; y++) {
    for (var x = 0; x <= granmoePNG.width; x++) {
      const pixel = greyCtx.getImageData(x, y, 1, 1)
      const [r, g, b] = pixel.data
      const [h, s, l] = convert.rgb.hsl(r, g, b)

      if (s !== 0) {
        const grey = convert.hsl.hex(h, 0, l)
        greyCtx.fillStyle = `#${grey}`
        greyCtx.fillRect(x, y, 1, 1)
      }
    }
  }

  greyCanvas.toBuffer(function(err, buf) {
    fs.writeFile(imgPath, buf, (err) => {
      resolve(buf)
    })
  })
}

function factory () {
  return new Promise(resolve => {
    toGreyScale(resolve, ...arguments)
  })
}

module.exports = factory