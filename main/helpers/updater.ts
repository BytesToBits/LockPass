import electronLogger from "electron-log"
import { autoUpdater, UpdateInfo } from '@imjs/electron-differential-updater';
import { dialog } from "electron";

const init = () => {
    autoUpdater.logger = electronLogger

    // @ts-ignore
    autoUpdater.logger.transports.file.level = "info"

    autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
        electronLogger.log(`Version ${info.version} downloaded`)

        dialog.showMessageBox({
            title: "New Update Available",
            detail: `Version ${info.version} available`,
            message: "A new version is available. Please restart to apply updates.",
            buttons: [ 'Restart', 'Later' ]
        }).then(returnValue => {
            if (returnValue.response == 0) autoUpdater.quitAndInstall(true, true)
        })
    })
}

export default {
    init,
    check: autoUpdater.checkForUpdates
}