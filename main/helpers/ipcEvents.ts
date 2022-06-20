import { randomUUID } from "crypto";
import { app, dialog, ipcMain, Notification } from "electron";
import Store from "electron-store";
import files from "./files";
import util from "../util";

const passwordStore = new Store({
  name: 'passwords'
})

const init = () => {
  Store.initRenderer()

  const getPasswords = () => {
    try {
      const passRecord = passwordStore.store
      const passwords = {}
      for(let id in passRecord) {
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

  ipcMain.handle("get-version", async() => {
    return app.getVersion()
  })

  ipcMain.handle("save-password", async(_, password) => {
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

  ipcMain.handle("select-file", async() => files.select())

  ipcMain.handle("save-file", async(_, path) => files.save(path, "testPy.png"))
};

export default {
  init,
};
