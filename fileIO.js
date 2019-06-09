var fs = require('fs')
var ph = require('path')

const walksDirectorys = (rootDir, doneCallback) => {
  let dirs = []
  const walks = (dir, doneCallback) => {
    let fils = []
    fs.readdir(dir, (err, files) => {
      if (err) return doneCallback(err)
      dirs.push(dir)
      let pending = files.length
      if (!pending) return doneCallback(null, fils, dirs)
      files.map(f => {
        fs.stat(ph.resolve(dir, f), (err, stat) => {
          if (stat && stat.isDirectory()) {
            walks(ph.resolve(dir, f), (err, res) => {
              fils = fils.concat(res)
              if (!--pending) return doneCallback(null, fils, dirs)
            })
          } else {
            fils.push(ph.resolve(dir, f))
            if (!--pending) return doneCallback(null, fils, dirs)
          }
        })
      })
    })
  }
  walks(rootDir, doneCallback)
}

const loadsFilesContents = (filesArray, doneCallback) => {
  let filesData = []
  let pending = filesArray.length
  filesArray.map(fa => {
    fs.readFile(fa, (err, data) => {
      filesData.push({ path: fa, data: data.toString()})
      if (!--pending) doneCallback(filesData)
    })
  })
}

const writesFile = (pagePath, pageHtml) => {
  fs.writeFile(pagePath, pageHtml, function (err) {
    if (err) console.log(err)
  })
}

const writesFiles = (pagesArray, callback) => {
  let pending = pagesArray.length
  pagesArray.map(p => {
    fs.writeFile(p.path, p.html, function (err) {
      if (err) console.log(err)
      if (!--pending) callback()
    })
  })
}

const copysFiles = (pathsArray, callback) => {
  let pending = pathsArray.length
  pathsArray.map(ps => {
    fs.copyFile(ps.src, ps.dst, err => {
      if (err) console.log(err);
      if (!--pending) callback()
    })
  })
}

const createsFolder = (path, callback) => {
  createsFolders([path], callback)
}

const createsFolders = (paths, callback) => {
  if (callback === undefined) callback = () => { return }
  let pending = paths.length
  paths.map(path => {
    fs.mkdir(path, err => {
      if (err) folderExists(err)
      if (!--pending) callback()
    })
  })
}

const folderExists = (err) => {
  if (err.code == 'EEXIST') return true
  console.log(err)
  return false
}

const removesFolder = (path) => {
  fs.rmdir(path, err => console.log(err) )
}

exports.walksDirectorys = walksDirectorys
exports.loadsFilesContents = loadsFilesContents
exports.writesFile = writesFile
exports.createsFolder = createsFolder
exports.createsFolders = createsFolders
exports.removesFolder = removesFolder
exports.copysFiles = copysFiles
