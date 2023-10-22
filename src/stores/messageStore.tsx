import {action, map} from 'nanostores'

import {db} from "./db/messages.ts";
import type {MessageProps} from "./types/message.ts";

export const messageMap = map<Record<string, MessageProps[]>>({})

export const initMessageStore = async () => {
    const data = await db.getMap() || {}
    messageMap.set(data)
}

export const getMessagesByConversationId = (conversationId: string) => {
    return messageMap.get()[conversationId] || []
}

export const deleteMessagesByConversationId =async (conversationId: string) => {
    await db.deleteItem(conversationId);
    messageMap.setKey(conversationId,[])
}

export const addMessage = action(
    messageMap,
    'addMessage',
    (map, conversationId: string, message: MessageProps) => {
        const oldMessages = map.get()[conversationId] || []
        map.setKey(conversationId, [...oldMessages, message])
        db.setItem(conversationId, [...oldMessages, message])
    },
)
