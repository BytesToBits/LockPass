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
    getAll: async() => {
      return await ipcRenderer.invoke("pass-request");
    },
    save: async(passwordData) => await ipcRenderer.invoke("save-password", passwordData),
    edit: async(uuid, passwordData) => {
      const newData = passwordData
      newData.edit = {
        lastModified: new Date().getTime()
      }
      await ipcRenderer.invoke("edit-password", uuid, newData)
    },
    delete: async (uuid) => {
        ipcRenderer.send("delete-pass", uuid);
        const passwords = await ipcRenderer.invoke("pass-request");

        return passwords
    },
    strength: (password) => {
      var score = 0;
      if (!password)
          return score;
  
      // award every unique letter until 5 repetitions
      var letters = new Object();
      for (var i=0; i<password.length; i++) {
          letters[password[i]] = (letters[password[i]] || 0) + 1;
          score += 5.0 / letters[password[i]];
      }
  
      // bonus points for mixing it up
      var variations = {
          digits: /\d/.test(password),
          lower: /[a-z]/.test(password),
          upper: /[A-Z]/.test(password),
          nonWords: /\W/.test(password),
      }
  
      var variationCount = 0;
      for (var check in variations) {
          variationCount += (variations[check] == true) ? 1 : 0;
      }
      score += (variationCount - 1) * 10;

      return score
    }
}