const express = require('express')
const promisify = require('promisify-node')
const fs = promisify('fs')
const { get, has, isNil } = require('lodash')

const {
  images: imageRoutes,
  buildRatingPath
} = require('./routes')
const imageToGreyScale = require('./image-processing/image-to-grey-scale')
const generateRatingImage = require('./image-processing/generate-rating-image')
const fetchOrMake = require('./fetch-or-make')

const app = express()

const GRANMOE_LIMIT = 5
const DEFAULT_USER = 'granmoe'

app.get('/rating/:user?/:value.:ext?', function (req, res) {
  let { user, value = 0, ext = 'png' } = req.params

  if (isNil(user) || !has(imageRoutes, user)) {
    user = DEFAULT_USER
  }

  value = Math.max(Math.min(value, GRANMOE_LIMIT), 0)

  const {
    color: colorPath,
    grey: greyPath
  } = get(imageRoutes, user)

  const ratingPath = buildRatingPath(user, value, ext)

  const greyMaker = colorImg => () => imageToGreyScale(greyPath, colorImg)
  const ratingMaker = imgArr => () => generateRatingImage(ratingPath, value, ...imgArr)

  fs.readFile(colorPath)
    .then(colorImg => new Promise(resolve => {
      fetchOrMake(greyPath, greyMaker(colorImg))
        .then(greyImg => resolve([colorImg, greyImg]))
    }))
    .then(imgArr => fetchOrMake(ratingPath, ratingMaker(imgArr)))
    .then(ratingImage => res.end(ratingImage, 'binary'))
})

app.get('/', function (req, res) {
  res.send('hello, granmoe')
})

app.listen(3000, function () {
  console.log('app started on port 3000')
})
