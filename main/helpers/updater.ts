import electronLogger from "electron-log"
import { autoUpdater, UpdateInfo } from '@imjs/electron-differential-updater';
import { BrowserWindow, app } from "electron";

const init = (splashWindow: BrowserWindow, mainWindow: BrowserWindow) => {
    autoUpdater.logger = electronLogger

    setInterval(() => {
        if (mainWindow) mainWindow.webContents.send('update-version', app.getVersion())
    }, 5000)

    // @ts-ignore
    autoUpdater.logger.transports.file.level = "info"

    autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
        electronLogger.log(`Version ${info.version} downloaded`)

        splashWindow.webContents.send("update-pending")
    })

    autoUpdater.on("download-progress", (progress) => {
        splashWindow.webContents.send("update-progress", progress.percent)
    })
}

export default {
    init,
    check: autoUpdater.checkForUpdates
}