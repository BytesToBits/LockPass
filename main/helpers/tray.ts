import { Tray, Menu, nativeImage } from "electron"
import util from "../util"

const init = async() => {
    const icon = nativeImage.createFromPath(util.getAsset("icon.ico"))
    const tray = new Tray(icon)
    
    const contextMenu = Menu.buildFromTemplate([
        { type: "separator" },
        { label: "Exit LockPass", role: "quit" }
    ])

    tray.setToolTip("LockPass")
    tray.setContextMenu(contextMenu)
}

export default {
    init
}