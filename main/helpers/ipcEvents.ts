import { randomUUID } from "crypto";
import { app, ipcMain, Notification } from "electron";
import Store from "electron-store";
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

  ipcMain.on("new-password", (event, password) => {
    if (!password.label || !password.value) {
      const notif = new Notification({
        title: "Password not saved",
        body: `Password was saved unsuccessfully! Make sure the password's label AND value are set.`,
        icon: util.getAsset("icon.ico"),
      });
      notif.show();
      return;
    }

    // TODO: Provide a more secure way of storing user passwords
    // Unique ID for the key to prevent duplicates when referenced by key
    const uniqueID = randomUUID();

    passwordStore.set(uniqueID, {
      label: password.label,
      name: password.name ? password.name : "No Username",
      value: password.value,
    })
  });

  ipcMain.on("delete-pass", (event, uuid) => {
    passwordStore.delete(uuid)
  });

  ipcMain.handle("pass-request", async (event) => {
    return getPasswords();
  });

  ipcMain.handle("get-version", async(event) => {
    return app.getVersion()
  })
};

export default {
  init,
};
