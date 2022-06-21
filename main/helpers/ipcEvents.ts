import { randomUUID } from "crypto";
import { app, ipcMain, Notification } from "electron";
import Store from "electron-store";
import files from "./files";
import util from "../util";
import { PasswordData } from "../../renderer/util/interfaces";
import userSettings from "./userSettings"

const passwordStore = new Store({
  name: 'passwords'
})

const init = () => {
  Store.initRenderer()

  const getPasswords = () => {
    try {
      const passRecord = passwordStore.store
      const passwords = {}
      for (let id in passRecord) {
        passwords[id] = passRecord[id]
      }

      return passwords;
    } catch (e) {
      return {};
    }
  };

  ipcMain.on("delete-pass", (_, uuid) => {
    passwordStore.delete(uuid)
  });

  ipcMain.handle("pass-request", async () => {
    return getPasswords();
  });

  ipcMain.handle("get-version", async () => {
    return app.getVersion()
  })

  ipcMain.handle("save-password", async (_, password) => {
    if (!password.label || !password.value) {
      const notif = new Notification({
        title: "Password not saved",
        body: `Password label & value are required.`,
        icon: util.getAsset("icon.ico"),
      });
      notif.show();
      return;
    }

    // TODO: Provide a more secure way of storing user passwords
    // Unique ID for the key to prevent duplicates when referenced by key
    const uniqueID = randomUUID();

    passwordStore.set(uniqueID, password)

    return true
  });

  ipcMain.handle("edit-password", async (_, uuid, password: PasswordData) => {
    if (!password.label || !password.value) {
      const notif = new Notification({
        title: "Password not edited",
        body: `Password label & value are required.`,
        icon: util.getAsset("icon.ico"),
      });
      notif.show();
      return;
    }
    
    passwordStore.set(uuid, password)
  })

  ipcMain.handle("select-file", async (_, options) => files.select(options))

  ipcMain.handle("get-setting", async(_, name) => userSettings.get(name))
  ipcMain.handle("update-setting", async(_, name, value) => userSettings.set(name, value))
};

export default {
  init,
};
