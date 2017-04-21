const path = require('path')
const fs = require('fs')

function fetchOrMake (resolve, imgPath, makeFn) {
  fs.readFile(imgPath, (err, res) => {
    if (res) {
      resolve(res)
    } else {
      ensureDirectoryExists(imgPath)
        .then(makeFn)
        .then(res => resolve(res))
    }
  })
}

function ensureDirectoryExists (imgPath) {
  const pathGen = pathGenerator()
  return new Promise(resolve => {
    loop(resolve)
  })

  function loop (resolve) {
    const { done, value } = pathGen.next()

    if (!done) {
      value.then(() => loop(resolve))
    } else {
      resolve(value)
    }
  }

  function* pathGenerator () {
    const { dir } = path.parse(imgPath)
    let goalDirChunks = dir.split(path.sep)
    let currDirChunks = dir.split(path.sep)
    let hasFoundDir = false

    let results = dir

    while (!hasFoundDir && currDirChunks.length) {
      yield new Promise(resolve => {
        fs.lstat(currDirChunks.join(path.sep), (err, stats) => {
          if (!err && stats.isDirectory()) {
            hasFoundDir = true
          } else {
            currDirChunks.pop()
          }
          resolve()
        })
      })
    }

    for (let key = 0; key <= goalDirChunks.length; key++) {
      yield new Promise(resolve => {
        if (goalDirChunks[key] === currDirChunks[key]) {
          resolve()
        } else {
          fs.mkdir(goalDirChunks.slice(0, key + 1).join(path.sep), () => {
            resolve()
          })
        }
      })
    }

    return true
  }
}

function factory () {
  return new Promise(resolve => {
    fetchOrMake(resolve, ...arguments)
  })
}

module.exports = factory