import React, {useEffect, useRef} from 'react'
import {Button} from "../ui";

import {conversations, currentConversationId} from "../../stores/conversationStore.tsx"

import {useFullscreen} from '../../hooks'
import {useStore} from '@nanostores/react'
import {chat, OpenAIConfig, RequestMessage} from "../../utils/openai.tsx";
import {addMessage, configurations} from "../../stores";
import {MessageProps} from "../../stores/types/message.ts";
import {getMessagesByConversationId, deleteMessagesByConversationId} from "../../stores/messageStore.tsx"
import MessageViewer from "./MessageViewer.tsx";
import {useI18n} from "../../hooks";

const Chat = () => {
    const [fullscreen, setFullscreen] = useFullscreen()

    const [inputValue, setInputValue] = React.useState('')
    const conversationId = useStore(currentConversationId);
    const conversation = useStore(conversations);
    const conf = useStore(configurations)
    const [height, setHeight] = React.useState('50px');
    const [steamingMessage, setStreamingMessage] = React.useState('');
    const [streaming, setStreaming] = React.useState(false);

    const {t} = useI18n()

    const [messages, setMessages] = React.useState<MessageProps[]>([]);


    useEffect(() => {
        configurations.set(conf)
    }, [conf])

    useEffect(() => {
        init()
    }, [conversationId])

    const init = async () => {
        const msgs = await getMessagesByConversationId(conversationId);
        setMessages(msgs);
    }

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const {value, rows} = event.target;
        console.log(event.target.scrollHeight)
        setInputValue(value);
        setHeight('inherit')
        setHeight(event.target.scrollHeight > 144 ? '144px' : event.target.scrollHeight + 'px')
    };

    const getConversationName = (cid: string) => {
        for (const item of conversation) {
            if (item.id === cid) {
                return item.title ? item.title : t('conversationname');
            }
        }
        return '';
    }
    const showSide = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element !== null) {
            element.classList.add('side-show');
        }
    }
    const addMsg = (role: 'user' | 'assistant' | 'system', message: string, code?: number) => {
        const rowId = 'id_' + Date.now()
        const messageBody: MessageProps = {
            id: rowId,
            conversationId: conversationId,
            messageId: '',
            createTime: Date.now(),
            role: role,
            content: message,
            code: code || 0
        }
        addMessage(conversationId, messageBody)
        init()
    }
    const sendMessage = () => {
        const finalMsg = inputValue.trim();
        if (!finalMsg || finalMsg === '') {
            return;
        }
        if (!conf.apikey) {
            addMsg('assistant', t('tipsline1'))
            return
        }
        setStreaming(true)
        const sendMessages: RequestMessage[] = [];

        sendMessages.push({
            role: 'user',
            content: finalMsg
        })
        addMsg('user', finalMsg)
        setInputValue('')
        const config: OpenAIConfig = {
            stream: true,
            top_p: conf.top_p,
            model: conf.model || 'gpt-3.5-turbo',
            temperature: conf.temperature,
            presence_penalty: conf.presence_penalty,
            frequency_penalty: conf.frequency_penalty
        }
        chat({
            messages: sendMessages,
            settings: conf,
            config: config,
            onMessage(message) {
                console.log('update',message)
                setStreamingMessage(message)
            },
            onFinish(message) {
                addMsg('assistant', message)
                console.log('finish', message)
                setStreaming(false)
                init()
            },
            onError(error) {
                console.log('error', error)
                setStreaming(false)
                init()
            }
        })
    }
    return (
        <div className={'h-full flex flex-col '}>
            <header className='header'>
                <div className={"flex gap-1.5 items-center"}>
                    <Button className={'autoshow'} icon='ri-menu-line'
                            onClick={() => showSide('side-l')}/>
                    <b>{getConversationName(conversationId)}</b></div>
                <div className={"flex gap-1.5 text-sm"}>
                    <Button icon={fullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'}
                            title={t('fullscreen')}
                            onClick={() => {
                                setFullscreen(!fullscreen)
                            }}/>
                    <Button icon='ri-delete-bin-2-line' title={t('clearallmessages')} onClick={async () => {
                        await deleteMessagesByConversationId(conversationId);
                        setMessages([])
                    }}/>
                    <Button className={'autoshow'} icon='ri-settings-4-line' onClick={() => showSide('side-r')}/>
                </div>
            </header>
            <MessageViewer  messages={messages} streaming={streaming} streamingMessage={steamingMessage}/>
            <div style={{position: 'sticky'}} className="absolute bottom-0 w-full border-t-1 p3 dark:border-dark-1">
                  <textarea
                      id='inputtext'
                      className={'chattext inputtext resize-none'}
                      style={{height: height}}
                      disabled={streaming}
                      placeholder={streaming ? t('thinking') : t('askmeanything')}
                      value={inputValue}
                      onChange={handleTextareaChange}/>
                {/*<Button className="absolute left-5 bottom-7  "*/}
                {/*        type={'normal'} size={'sm'} icon='ri-image-line' onClick={() => sendMessage()}/>*/}
                <Button className={'absolute right-5 bottom-7  '}
                        disabled={streaming}
                        type={'success'} size={'sm'} icon='ri-mail-send-fill'
                        onClick={() => sendMessage()}/>
            </div>
        </div>
    )
}
export default Chat