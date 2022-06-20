import { app, dialog } from "electron"
import fs from "fs"

export default {
    select: (extraOptions?) => {
        const fp = dialog.showOpenDialogSync({
          title: "Select Password Icon",
          filters: [
            { name: "Images", extensions: ['jpg', 'jpeg', 'ico', 'png'] }
          ],
          properties: ["openFile"],
          ...extraOptions
        })
    
        return fp
    },
    save: (path, name) => {
      console.log(app.getAppPath())
      fs.mkdir(`${app.getAppPath()}/icons`, (err) => {
        if(err) dialog.showErrorBox("Failed to create icon directory", err.message)
      })
      fs.copyFile(path, `${app.getAppPath()}/icons/${name}`, (err) => {
        if(err) dialog.showErrorBox("Failed to save file", err.message)
      })
    },
    getPath: (name) => `${app.getAppPath()}/icons/${name}`
}