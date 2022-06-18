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

}