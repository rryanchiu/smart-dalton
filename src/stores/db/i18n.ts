import {createStore, get, set, update, UseStore} from 'idb-keyval'

const store: UseStore = createStore('i18n', 'keyval');

const setItem = async (key: string, item: string) => {
    if (store)
        await set(key, item, store)
}

const getItem = async (key: string) => {
    if (store)
        return await get<string>(key, store)
    return null
}

const updateItem = async (key: string, item: string) => {
    if (store)
        await update(key, () => item, store)
}

export const db = {
    getItem,
    setItem,
    updateItem,
}
