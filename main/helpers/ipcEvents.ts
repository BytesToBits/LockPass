import { randomUUID } from "crypto";
import { ipcMain, Notification } from "electron";
import fs from "fs";
import path from "path";

const init = () => {
  const getPasswords = () => {
    try {
      let passwords = JSON.parse(fs.readFileSync("passwords.json").toString());
      return passwords;
    } catch (e) {
      return {};
    }
  };

  ipcMain.on("new-password", (event, password) => {
    console.log(password);
    const passwords = getPasswords();

    if (!password.label || !password.value) {
      const notif = new Notification({
        title: "Password not saved",
        body: `Password was saved unsuccessfully! Make sure the password's label AND value are set.`,
        icon: path.join(__dirname, '..', 'resources', 'icon.ico'),
      });
      notif.show();
      return;
    }

    // TODO: Provide a better way of storing user passwords
    // Unique ID for the key to prevent duplicates when referenced by key
    const uniqueID = randomUUID();
    passwords[uniqueID] = {
      label: password.label,
      name: password.name ? password.name : "No Username",
      value: password.value,
    };
    fs.writeFileSync("passwords.json", JSON.stringify(passwords));
  });

  ipcMain.on("delete-pass", (event, uuid) => {
    const passwords = getPasswords();
    delete passwords[uuid];
    fs.writeFileSync("passwords.json", JSON.stringify(passwords));
  });

  ipcMain.handle("pass-request", async (event) => {
    return getPasswords();
  });
};

export default {
  init,
};
