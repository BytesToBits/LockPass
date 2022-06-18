import { Tray, Menu } from "electron"
import path from "path"

const init = () => {
    const tray = new Tray(path.join(__dirname, '..', 'resources', 'icon.ico'))
    
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