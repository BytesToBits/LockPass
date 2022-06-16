import { autoUpdater, ipcMain, Notification } from "electron";
import fs from "fs"
import path from "path"

const init = () => {
    const getPasswords = () => {
        try {
          let passwords = JSON.parse(fs.readFileSync('passwords.json').toString())
          return passwords
        } catch (e) {
          return {}
        }
      }
    
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

    ipcMain.on('restart-update', () => { autoUpdater.quitAndInstall() })
    
    ipcMain.handle('pass-request', async(event) => {
        return getPasswords()
    })
    
}

export default {
    init
}