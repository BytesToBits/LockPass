import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import electronLogger from "electron-log"

import ipcEvents from './helpers/ipcEvents';
import updater from './helpers/updater';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (!isProd) {
  electronLogger.log(app.getVersion())
}

const renderPage = (pageName) => isProd ? `app://./${pageName}.html` : `http://localhost:${process.argv[2]}/${pageName}`

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const splashWindow = createWindow('splash', {
    width: 400,
    height: 500,
    frame: false,
    resizable: false,
    center: true,
    show: false
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

  updater.init(splashWindow, mainWindow)
  ipcEvents.init()
  if(isProd) updater.check()

  splashWindow.on('ready-to-show', () => splashWindow.show)

  ipcMain.on('open-main', () => {
    mainWindow.show()
    splashWindow.close()
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
} catch (e) {}

app.on('window-all-closed', () => {
  app.quit();
});