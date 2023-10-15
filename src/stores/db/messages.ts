import {get, set, update, del, UseStore, createStore, entries} from 'idb-keyval'

const store: UseStore = createStore('messages', 'keyval');


import type {MessageProps} from "../types/message.ts";

// type ConversationRecord = Record<string, string | number | boolean>

const setItem = async (key: string, item: MessageProps[]) => {
    if (store)
        await set(key, item, store)
}

const getItem = async (key: string) => {
    if (store)
        return await get<MessageProps[]>(key, store)
    return null
}

const updateItem = async (key: string, item: MessageProps[]) => {
    if (store)
        await update(key, () => item, store)
}


const deleteItem = async (key: string) => {
    if (store)
        await del(key, store)
}

const getMap = async () => {
    if (store) {
        const list = await entries(store)
        return Object.fromEntries(list) as Record<string, MessageProps[]>
    }
    return null
}

export const db = {
    getItem,
    setItem,
    updateItem,
    deleteItem,
    getMap,
}
