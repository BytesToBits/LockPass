import { Tray, Menu, nativeImage, BrowserWindow } from "electron"
import util from "../util"

const init = async() => {
    const icon = nativeImage.createFromPath(util.getAsset("icon.ico"))
    const tray = new Tray(icon)
    
    const contextMenu = Menu.buildFromTemplate([
        { type: "separator" },
        { label: "Exit LockPass", role: "quit" }
    ])

    tray.on('right-click', () => {
        if(BrowserWindow.getAllWindows().length > 1) {
            const win = BrowserWindow.getAllWindows()[0]
            win.show()
            win.restore()
        }
    })

    tray.setToolTip("LockPass")
    tray.setContextMenu(contextMenu)
}

export default {
    init
}