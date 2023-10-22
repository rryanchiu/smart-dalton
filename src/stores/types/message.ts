export interface MessageProps {
    id: string
    conversationId: string
    messageId: string
    createTime?: number
    role?: 'dalton' |'system' | 'user' | 'assistant'
    code?: number
    msg?: string
    content?: string
}
