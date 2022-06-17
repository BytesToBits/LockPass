import { randomUUID } from "crypto";
import { ipcMain, Notification } from "electron";
import fs from "fs";
import { uniqueId } from "lodash";
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
        icon: "resources/icon.ico",
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

    const notif = new Notification({
      title: "Password Saved",
      body: `New Password ${password.name} was saved!`,
      icon: "resources/icon.ico",
    });
    notif.show();
    return;
  });

  ipcMain.on("delete-pass", (event, uuid) => {
    const passwords = getPasswords();
    delete passwords[uuid];
    fs.writeFileSync("passwords.json", JSON.stringify(passwords));

    const notif = new Notification({
      title: "Password Deleted",
      body: `New Password ${name} was deleted!`,
      icon: path.join(
        __dirname,
        "..",
        "renderer",
        "public",
        "images",
        "icon.png"
      ),
    });
    notif.show();
  });

  ipcMain.handle("pass-request", async (event) => {
    return getPasswords();
  });
};

export default {
  init,
};
