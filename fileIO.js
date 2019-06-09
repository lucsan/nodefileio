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

const loadsFilesContents = (files, doneCallback) => {
  let filesData = []
  let pending = files.length
  files.map(fa => {
    fs.readFile(fa, (err, data) => {
      filesData.push({ path: fa, data: data.toString()})
      if (!--pending) doneCallback(filesData)
    })
  })
}

const writesFile = (path, string) => {
  fs.writeFile(path, string, function (err) {
    logError(err)
  })
}

const writesFiles = (files, callback) => {
  let pending = files.length
  files.map(p => {
    fs.writeFile(p.path, p.string, function (err) {
      logError(err)
      if (!--pending) callback()
    })
  })
}

const copysFiles = (files, callback) => {
  let pending = files.length
  files.map(ps => {
    fs.copyFile(ps.src, ps.dst, err => {
      logError(err)
      if (!--pending) callback()
    })
  })
}

const createsFolder = (path, callback) => {
  createsFolders([path], callback)
}

const createsFolders = (paths, callback) => {
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
  logError(err)
  return false
}

const removesFolder = (path, callback) => {
  removesFolders([path], callback)
}

const removesFolders = (paths, callback) => {
  let pending = paths.length
  paths.map(path => {
    fs.rmdir(path, err => {
      if (err && err != null) logError(err)
      if (!--pending) callback()
    })
  })
}

const removesFiles = (paths, callback) => {
  let pending = paths.length
  paths.map(path => {
    fs.unlink(path, err => {
      logError(err)
      if (!--pending) callback()
    })
  })
}

const logError = (err) => {
  if (err) console.log(err)
}

exports.walksDirectorys = walksDirectorys
exports.loadsFilesContents = loadsFilesContents
exports.writesFile = writesFile
exports.writesFiles = writesFiles
exports.createsFolder = createsFolder
exports.createsFolders = createsFolders
exports.removesFolder = removesFolder
exports.removesFolders = removesFolders
exports.removesFiles = removesFiles
exports.copysFiles = copysFiles
