const electronInstaller = require('electron-winstaller')
const path = require('path')

const resultPromise = electronInstaller.createWindowsInstaller({
  appDirectory: path.join('./dist/electron/Packaged/Quasar_App-win32-x64'),
  outputDirectory: path.join('./tmp/build/installer64'),
  authors: 'Ian',
  exe: 'QuasarApp.exe',
  noMsi: true
})

resultPromise.then(() => console.log('It worked!'), (e) => console.log(`No dice: ${e.message}`))
