export interface MessageProps {
    id: string
    conversationId: string
    messageId: string
    createTime?: number
    role?: 'system' | 'user' | 'assistant'
    code?: string
    msg?: string
    content?: string
}
