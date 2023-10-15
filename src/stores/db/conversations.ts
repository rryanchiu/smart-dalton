import {get, set, update, del, UseStore, createStore, values} from 'idb-keyval'

const store: UseStore = createStore('conversations', 'keyval');


import type {ConversationProps} from "../types/conversation.ts";

// type ConversationRecord = Record<string, string | number | boolean>

const setItem = async (key: string, item: ConversationProps) => {
    if (store)
        await set(key, item, store)
}

const getItem = async (key: string) => {
    if (store)
        return await get<ConversationProps>(key, store)
    return null
}

const updateItem = async (key: string, item: ConversationProps) => {
    if (store)
        await update(key, () => item, store)
}


const deleteItem = async (key: string) => {
    if (store)
        await del(key, store)
}

const list = async () => {
    if (store) {
        const entriesData:ConversationProps[] = await values(store)
        return entriesData.reverse()
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
