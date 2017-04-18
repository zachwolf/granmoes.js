const express = require('express')
const Canvas = require('canvas')
const Image = Canvas.Image
const promisify = require("promisify-node")
const convert = require('color-convert')

const fs = promisify("fs")
const app = express()

const GRANMOE_LIMIT = 5

app.get('/rating/:value', function (req, res) {
  const rating = parseFloat(req.params.value, 10)
  const minGranmoe = Math.min(GRANMOE_LIMIT, rating)

  const ratingInt = Math.floor(minGranmoe)
  const ratingFloat = minGranmoe % 1

  fs.readFile(__dirname + '/public/granmoe.png')
    .then(function(granmoe) {
      // original image
      const granmoePNG = new Image()
      granmoePNG.src = granmoe

      // final image
      const canvas = new Canvas(granmoePNG.width * 5, granmoePNG.height)
      const ctx = canvas.getContext('2d')

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

      const granmoeTheGreyPNG = new Image()
      granmoeTheGreyPNG.src = greyCanvas.toDataURL()

      // draw grey background images
      for (let i = 0; i <= GRANMOE_LIMIT; i++) {
        ctx.drawImage(granmoeTheGreyPNG, i * granmoePNG.width, 0, granmoePNG.width, granmoePNG.height)
      }

      // draw colored whole rating
      for (let i = 0; i <= ratingInt - 1; i++) {
        ctx.drawImage(granmoePNG, i * granmoePNG.width, 0, granmoePNG.width, granmoePNG.height)
      }

      // draw colored part rating
      const granmoePattern = ctx.createPattern(granmoePNG, "repeat")
      ctx.fillStyle = granmoePattern
      ctx.fillRect(ratingInt * granmoePNG.width, 0, granmoePNG.width * ratingFloat, granmoePNG.height)

      canvas.toBuffer(function(err, buf) {
        res.end(buf, 'binary')
      })
    })
})

app.get('*', function (req, res) {
  const options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  res.sendFile('index.html', options, function (err) {
    if (err) {
      next(err);
    }
  });
})

app.listen(3000, function () {
  console.log('app started on port 3000')
})