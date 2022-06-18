import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';
import electronLogger from "electron-log";
import { autoUpdater, UpdateInfo } from "@imjs/electron-differential-updater"
import ipcEvents from './helpers/ipcEvents';
import tray from './helpers/tray';
import util, { isProd } from './util';

// AUTO UPDATER
autoUpdater.logger = electronLogger

// @ts-ignore
autoUpdater.logger.transports.file.level = "info"
// AUTO UPDATER

if (!isProd) {
  electronLogger.log(app.getVersion())
}

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
  await splashWindow.loadURL(util.renderPage("splash"))

  let mainWindow = createWindow('main', {
    minWidth: 650,
    minHeight: 400,
    center: true,
    show: false,
    frame: false
  })
  mainWindow.loadURL(util.renderPage("main"))

  autoUpdater.on("update-not-available", () => {
    splashWindow.webContents.send("load-window")
  })

  autoUpdater.on("error", () => {
      splashWindow.webContents.send("load-window")
  })

  autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
      electronLogger.log(`Version ${info.version} downloaded`)
      autoUpdater.quitAndInstall()
  })

  autoUpdater.on("download-progress", (progress) => {
      splashWindow.webContents.send("update-progress", progress)
  })

  if(isProd) {
    ipcMain.on('check-updates', () => {
      if(isProd) { autoUpdater.checkForUpdates() }
      else { splashWindow.webContents.send('load-window') }
    })
  }

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

  splashWindow.show()

  await tray.init()
  ipcEvents.init()
  

})();


try {
  app.setAppUserModelId("Password Manager")
} catch (e) {}

app.on('window-all-closed', () => {
  app.quit();
});