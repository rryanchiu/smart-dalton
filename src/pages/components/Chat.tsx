import React, {useEffect, useRef} from 'react'
import {Button} from "../ui";

import {conversations, currentConversationId} from "../../stores/conversationStore.tsx"

import {useFullscreen, useI18n} from '../../hooks'
import {useStore} from '@nanostores/react'
import {chat, OpenAIConfig, RequestMessage} from "../../utils/openai.tsx";
import {addMessage, currentConfiguration} from "../../stores";
import {MessageProps} from "../../stores/types/message.ts";
import {deleteMessagesByConversationId, getMessagesByConversationId} from "../../stores/messageStore.tsx"
import MessageViewer from "./MessageViewer.tsx";
import KeyboardEventHandler from 'react-keyboard-event-handler';

const Chat = () => {
    const [fullscreen, setFullscreen] = useFullscreen()

    const [inputValue, setInputValue] = React.useState('')
    const conversationId = useStore(currentConversationId);
    const conversation = useStore(conversations);
    const conf = useStore(currentConfiguration)
    const [height, setHeight] = React.useState('50px');
    const [steamingMessage, setStreamingMessage] = React.useState('');
    const [streaming, setStreaming] = React.useState(false);
    const inputRef: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);
    const {t} = useI18n()

    const [messages, setMessages] = React.useState<MessageProps[]>([]);


    useEffect(() => {
        init()
    }, [conversationId])

    const init = async () => {
        const msgs = await getMessagesByConversationId(conversationId);
        setMessages(msgs);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }, 300)

    }

    const handleTextareaChange = (value: string) => {
        setInputValue(value);
        if (!inputRef.current) {
            return
        }


        if (inputRef.current.scrollHeight > 144 && height != '144px') {
            setHeight('144px')
            return;
        }
        if (inputRef.current.scrollHeight > inputRef.current.offsetHeight) {
            setHeight(inputRef.current.scrollHeight + 'px')
        }
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
        const msgs = messages.slice(-10);
        for (const msgItem of msgs) {
            if (!msgItem.role || !msgItem.content) {
                continue
            }
            sendMessages.push({
                role: msgItem.role,
                content: msgItem.content
            })
        }

        sendMessages.push({
            role: 'user',
            content: finalMsg
        })
        addMsg('user', finalMsg)
        setInputValue('')
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        const config: OpenAIConfig = {
            stream: true,
            top_p: Number(conf.top_p),
            model: conf.model || 'gpt-3.5-turbo',
            temperature: Number(conf.temperature),
            presence_penalty: Number(conf.presence_penalty),
            frequency_penalty: Number(conf.frequency_penalty)
        }
        chat({
            messages: sendMessages,
            settings: conf,
            config: config,
            onMessage(message) {
                setStreamingMessage(message)
            },
            onFinish(message) {
                addMsg('assistant', message)
                setStreaming(false)
                setStreamingMessage("")
                init()
            },
            onError(error) {
                console.error(error)
                addMsg('assistant', error && error.message ? error.message : 'ERROR')
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
                    <Button icon={fullscreen === 'false' ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'}
                            title={t('fullscreen')}
                            onClick={() => {
                                setFullscreen(fullscreen === 'true' ? 'false' : 'true')
                            }}/>
                    <Button icon='ri-delete-bin-2-line' title={t('clearallmessages')} onClick={async () => {
                        await deleteMessagesByConversationId(conversationId);
                        setMessages([])
                    }}/>
                    <Button className={'autoshow'} icon='ri-settings-4-line' onClick={() => showSide('side-r')}/>
                </div>
            </header>
            <MessageViewer messages={messages} streaming={streaming} streamingMessage={steamingMessage}/>
            <div style={{position: 'sticky'}} className="absolute bottom-0 w-full border-t-1 p3 dark:border-dark-1">
                <KeyboardEventHandler
                    handleKeys={['ctrl + enter']}
                    onKeyEvent={() => {
                        sendMessage()
                    }}>
                <textarea
                    ref={inputRef}
                    className={'chattext inputtext resize-none'}
                    style={{height: height}}
                    disabled={streaming}
                    autoComplete="off"
                    placeholder={streaming ? t('thinking') : t('askmeanything')}
                    onInput={() => {
                        const val = !inputRef.current ? '' : inputRef.current.value;
                        handleTextareaChange(val);
                    }}/>
                    <Button className={'absolute right-5 bottom-7  '}
                            disabled={streaming}
                            type={'success'} size={'sm'} icon='ri-mail-send-fill'
                            onClick={() => sendMessage()}/>
                </KeyboardEventHandler>
            </div>
        </div>
    )
}
export default Chat