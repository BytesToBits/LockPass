import Store from "electron-store"

const settingStore = new Store({
    name: "settings",
    defaults: {
        beta: false
    },
    clearInvalidConfig: true
})

export default settingStore