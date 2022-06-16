import { app, dialog, ipcMain, Notification } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import fs from "fs"
import path from 'path';

import { autoUpdater, UpdateInfo } from "electron-updater"

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  // AUTO UPDATER
  //const server = 'https://your-deployment-url.com'
  //const url = `${server}/update/${process.platform}/${app.getVersion()}`

  autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
    dialog.showMessageBox({
      title: "New Update Available",
      detail: `Version ${info.version} available`,
      message: "A new version is available. Please restart to apply updates.",
      buttons: [ 'Restart', 'Later' ]
    }).then(returnValue => {
      if (returnValue.response == 0) autoUpdater.quitAndInstall(true, true)
    })
  })

  // AUTO UPDATER
}
const renderPage = (pageName) => isProd ? `app://./${pageName}.html` : `http://localhost:${process.argv[2]}/${pageName}`

const getPasswords = () => {
  try {
    let passwords = JSON.parse(fs.readFileSync('passwords.json').toString())
    return passwords
  } catch (e) {
    return {}
  }
}

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  if(isProd) {
    setInterval(() => {
      autoUpdater.checkForUpdates()
    }, 10000)
  }

  const splashWindow = createWindow('splash', {
    width: 400,
    height: 500,
    frame: false,
    resizable: false,
    center: true
  });

  await splashWindow.loadURL(renderPage("splash"))

  let mainWindow = createWindow('main', {
    minWidth: 400,
    minHeight: 400,
    center: true,
    show: false,
    frame: false
  })

  mainWindow.loadURL(renderPage("main"))

  setInterval(() => {
    if (mainWindow) mainWindow.webContents.send('update-version', app.getVersion())
  }, 1000)

  ipcMain.on('open-main', () => {
    mainWindow.show()
    splashWindow.close()
  })

  ipcMain.on('new-password', (event, password) => {
    const passwords = getPasswords()

    if (password.name && password.value) {
      passwords[password.name] = password.value
      fs.writeFileSync("passwords.json", JSON.stringify(passwords))

      const notif = new Notification({
        title: "Password Saved",
        body: `New Password ${password.name} was saved!`,
        icon: "resources/icon.ico"
      })
      notif.show()
    } else {
      const notif = new Notification({
        title: "Password not saved",
        body: `Password ${password.name} was saved unsuccessfully! Make sure the password's name AND value are set.`,
        icon: "resources/icon.ico"
      })
      notif.show()
    }
  })

  ipcMain.on('delete-pass', (event, name) => {
      const passwords = getPasswords()
      
      delete passwords[name]
      fs.writeFileSync("passwords.json", JSON.stringify(passwords))

      const notif = new Notification({
        title: "Password Deleted",
        body: `New Password ${name} was deleted!`,
        icon: path.join(__dirname, "..", "renderer", "public", "images", "icon.png"),
      })
      notif.show()
    })

  ipcMain.handle('pass-request', async(event) => {
    return getPasswords()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  

  ipcMain.on('close-app', app.quit)
  ipcMain.on('minimize-app', () => {
    if(!mainWindow) {
      mainWindow = createWindow('main', {
        minWidth: 400,
        minHeight: 400,
        center: true,
        show: false,
        frame: false
      })
    }
    mainWindow.minimize()
  })
  ipcMain.on('maximize-app', () => {
    if(!mainWindow) {
      mainWindow = createWindow('main', {
        minWidth: 400,
        minHeight: 400,
        center: true,
        show: false,
        frame: false
      })
    }
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })

})();

try {
  app.setAppUserModelId("Password Manager")
} catch (e) {
  
}

app.on('window-all-closed', () => {
  app.quit();
});