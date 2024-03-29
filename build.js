const electronInstaller = require('electron-winstaller')
const path = require('path')

const resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: path.join('./dist/electron/Packaged/QuasarApp-win32-x64'),
  outputDirectory: path.join('./tmp/installer64'),
  authors: 'Ian',
  exe: 'QuasarApp.exe',
  noMsi: true
})

resultPromise.then(() => console.log('It worked!'), (e) => console.log(`No dice: ${e.message}`))
