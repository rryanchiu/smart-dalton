import {createStore, del, entries, get, set, update, UseStore} from 'idb-keyval'
import {ConfigurationProps} from "../types/configuration.ts";

const store: UseStore = createStore('configurations', 'keyval');


const setItem = async (key: string, item: ConfigurationProps) => {
    if (store) {
        await set(key, item, store)
    }
}

const getItem = async (key: string) => {
    if (store)
        return await get<ConfigurationProps>(key, store)
    return null
}

const updateItem = async (key: string, item: ConfigurationProps) => {
    if (store)
        await update(key, () => item, store)
}


const deleteItem = async (key: string) => {
    if (store)
        await del(key, store)
}

const list = async () => {
    if (store) {
        const entriesData = await entries(store)
        return Object.fromEntries(entriesData) as Record<string, ConfigurationProps>
    }
    return null
}

export const db = {
    getItem,
    setItem,
    updateItem,
    deleteItem,
    list,
}
