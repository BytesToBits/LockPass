import { ipcMain } from "electron"
import { RequestInfo, RequestInit } from "node-fetch";
import 'dotenv/config'

const fetch = (url: RequestInfo, init?: RequestInit) =>  import("node-fetch").then(({ default: fetch }) => fetch(url, init));

const CHANGELOG_URL = "https://api.github.com/repos/BytesToBits/LockPass/commits"
const RELEASE_URL = "https://api.github.com/repos/BytesToBits/LockPass/releases"

const init = () => {
    ipcMain.handle('get-changelog', async(_) => {
        const res = await fetch(CHANGELOG_URL, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.NAME}:${process.env.TOKEN}`).toString("base64")}`
            }
        })

        return await res.json()
    })

    ipcMain.handle('get-releases', async(_) => {
        const res = await fetch(RELEASE_URL, {
            headers: {
                Authorization: `Basic ${Buffer.from(`${process.env.NAME}:${process.env.TOKEN}`).toString("base64")}`
            }
        })

        return await res.json()
    })
}

export default {
    init
}