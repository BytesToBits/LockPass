import _ from "lodash";
import { ipcRenderer } from "electron";

export default {
    generate: () => {
        const CHARS =
          "1234567890-=_+asdfghjkl;zxcvbnm,.!@#$%^&*()ASDFGHJKLZXCVBNM<>?";
        let password = "";
        for (let i = 0; i < _.range(12, 25)[Math.floor(Math.random() * 12)]; i++) {
          password += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
    
        return password
      },
    save: async(passwordData) => {
        ipcRenderer.send("new-password", passwordData);
      
        const passwords = await ipcRenderer.invoke("pass-request");

        return passwords
    },
    delete: async (uuid) => {
        ipcRenderer.send("delete-pass", uuid);
        const passwords = await ipcRenderer.invoke("pass-request");

        return passwords
    },
    strength: (password) => {
        let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
        let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))')

        if (strongPassword.test(password)) return 2
        else if (mediumPassword.test(password)) return 1
        else return 0
    }
}