import {atom} from 'nanostores'

import {db} from "./db/conversations.ts";
import type {ConversationProps} from "./types/conversation.ts";
import {switchConversation} from "./configurationStore.tsx";

export const conversations = atom<ConversationProps[]>([])
export const currentConversationId = atom('')

export const fetchData = async () => {
    const dataList = await db.list() || []
    if (!dataList || dataList.length <= 0) {
        const data = await addConversation();
        dataList.push(data)
    }
    return dataList;
}

export const initConversations = async () => {
    const dataList = await fetchData()
    conversations.set(dataList)
    const crt = localStorage.getItem('currentConversation')
    if (crt) {
        currentConversationId.set(crt)
    } else if (dataList && dataList.length > 0) {
        currentConversationId.set(dataList[0].id)
        localStorage.setItem('currentConversation', currentConversationId.get())

    }
    switchConversation(currentConversationId.get())

}

export const updateConversation = async (data: ConversationProps) => {
    if (!data || !data.id) {
        return
    }
    data.updateTime = Date.now();
    await db.setItem(data.id, data)
}

export const deleteConversation = async (id: string) => {
    await db.deleteItem(id)
}

export const addConversation = async (data?: ConversationProps) => {
    const rowId = 'id_' + Date.now()
    if (!data) {
        data = {
            id: rowId,
            title: '新的对话',
            createTime: Date.now(),
            updateTime: Date.now()
        }
    }
    data.id = rowId
    await db.setItem(rowId, data)
    initConversations()
    return data
}
export const selectConversation = async (cid: string) => {
    currentConversationId.set(cid)
    switchConversation(cid)
    localStorage.setItem('currentConversation', cid)
}

initConversations()
