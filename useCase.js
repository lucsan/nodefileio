// If using npm install (ie: node_modules)
//const fio = require('nodefileio')

// If using file locally
const fio = require('./fileIO.js')

const filesRemoved = () => {
  fio.removesFolders([
    'testFolder/test1/',
    'testFolder/test2/'
  ], () => {
    // Because its windows the parent folder needs to be deleted speratly.
    fio.removesFolder('testFolder', () => { console.info('done') })
  })
}

const filesCopied = () => {
  fio.removesFiles([
    'testFolder/test1/file1.txt',
    'testFolder/test2/file2.txt',
    'testFolder/test2/package.json'
  ], filesRemoved)
}

const foldersStructure = () => {
  fio.walksDirectorys('testFolder/', (err, files, dirs) => {
    console.info('err:', err)
    console.info('files:', files)
    console.info('dirs:', dirs)
    filesCopied()
  })
}

const filesWriten = () => {
  fio.copysFiles([{ src: 'package.json', dst: 'testFolder/test2/package.json' }], foldersStructure)
}

const testFoldersMade = () => {
  fio.writesFile('testFolder/test1/file1.txt', 'This is the string content of file1.txt.')
  fio.writesFiles([{path: 'testFolder/test2/file2.txt', string: 'Some text for file2.'}], filesWriten)
}



const testFolderMade = () => {
  fio.createsFolders(['testFolder/test1', 'testFolder/test2'], testFoldersMade)
}

fio.createsFolder('testFolder', testFolderMade)
