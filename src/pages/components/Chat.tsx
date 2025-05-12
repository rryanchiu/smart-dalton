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
import {map} from "nanostores";
import {actors} from "../../config/actors.tsx";
import {abortController, initActor} from "../../stores/global.tsx";
import {ActorProp} from "../../types/ActorProp.ts";

const Chat = () => {
    const [fullscreen, setFullscreen] = useFullscreen()

    const conversationId = useStore(currentConversationId);
    const conversation = useStore(conversations);
    const conf = useStore(currentConfiguration)
    const [height, setHeight] = React.useState('50px');
    const [steamingMessage, setStreamingMessage] = React.useState('');
    const [streaming, setStreaming] = React.useState(false);
    const inputRef: React.RefObject<HTMLTextAreaElement> = useRef<HTMLTextAreaElement>(null);
    const {t} = useI18n()
    const initActorStatus = useStore(initActor);

    useEffect(() => {
        if (initActor.get()) {
            sendInitActorMessage();
        }
    }, [initActorStatus]);

    const [messages, setMessages] = React.useState<MessageProps[]>([]);


    const actorMap = map<Record<string, ActorProp>>({})

    const getActorContentById = (id: string) => {
        const item = actorMap.get()[id];
        if (item) {
            return item.content;
        }

        for (const actor of actors) {
            if (actor.id === id) {
                actorMap.setKey(id, actor)
                return actor.content;
            }
        }
        return '';
    }
    const getActorConfById = (id: string) => {
        const item = actorMap.get()[id];
        if (item && item.config) {
            return item.config;
        }

        return conf;
    }

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
    const addMsg = async (role: 'dalton' | 'user' | 'assistant' | 'system', message: string, code?: number) => {
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
        await addMessage(conversationId, messageBody);
        init()
    }
    const stopChat = () => {
        const controller = abortController.get();
        if (controller != null) {
            controller.abort("stop");
        }
    }
    const sendMessage = () => {
        if (!inputRef.current) {
            return
        }
        const controller = new AbortController();
        abortController.set(controller)
        const finalMsg = inputRef.current.value.trim();
        if (!finalMsg || finalMsg === '') {
            return;
        }
        if (!conf.apikey) {
            addMsg('dalton', t('tipsline1'))
            return
        }
        inputRef.current.blur()
        setStreaming(true)
        const sendMessages: RequestMessage[] = [];
        if (conf.actorId && !conf.actorId.includes('no_actor')) {
            sendMessages.push({
                role: 'system',
                content: getActorContentById(conf.actorId)
            })
        }
        const filteredMessages = messages.filter(message => message.role !== 'dalton');
        const msgs = filteredMessages.slice(-10);
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
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        const actorConf = getActorConfById(conf.actorId);
        const config: OpenAIConfig = {
            stream: true,
            top_p: Number(actorConf.top_p),
            model: actorConf.model || 'gpt-3.5-turbo',
            temperature: Number(actorConf.temperature),
            presence_penalty: Number(actorConf.presence_penalty),
            frequency_penalty: Number(actorConf.frequency_penalty)
        }
        chat({
            messages: sendMessages,
            settings: conf,
            config: config,
            onMessage(message) {
                setStreamingMessage(message)
            },
            onFinish(message) {
                if (message)
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

    const sendInitActorMessage = async () => {
        if (!inputRef.current) {
            return
        }
        const controller = new AbortController();
        abortController.set(controller)
        const finalMsg = getActorContentById(conf.actorId)
        if (!finalMsg || finalMsg === '') {
            return;
        }
        if (!conf.apikey) {
            addMsg('dalton', t('tipsline1'))
            return
        }
        inputRef.current.blur()
        setStreaming(true)
        const sendMessages: RequestMessage[] = [];
        sendMessages.push({
            role: 'user',
            content: finalMsg
        })
        sendMessages.push({
            role: 'user',
            content: finalMsg
        })
        addMsg('user', finalMsg)
        if (inputRef.current) {
            inputRef.current.value = ''
        }
        const actorConf = getActorConfById(conf.actorId);
        const config: OpenAIConfig = {
            stream: true,
            top_p: Number(actorConf.top_p),
            model: actorConf.model || 'gpt-3.5-turbo',
            temperature: Number(actorConf.temperature),
            presence_penalty: Number(actorConf.presence_penalty),
            frequency_penalty: Number(actorConf.frequency_penalty)
        }

        chat({
            messages: sendMessages,
            settings: conf,
            config: config,
            onMessage(message) {
                setStreamingMessage(message)
                initActor.set(false)
            },
            onFinish(message) {
                if (message)
                    addMsg('assistant', message)
                setStreaming(false)
                setStreamingMessage("")
                init()
                initActor.set(false)
            },
            onError(error) {
                console.error(error)
                addMsg('assistant', error && error.message ? error.message : 'ERROR')
                setStreaming(false)
                init()
                initActor.set(false)
            }
        })
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toLowerCase().includes('mac');
            const isCommandOrCtrlPressed = isMac ? e.metaKey : e.ctrlKey;

            if (isCommandOrCtrlPressed && e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [sendMessage]);


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

                <textarea
                    ref={inputRef}
                    className={'chattext inputtext resize-none'}
                    style={{height: height}}
                    disabled={streaming}
                    autoComplete="off"
                    placeholder={streaming ? t('thinking') : t('askmeanything')}
                    onFocus={() => setHeight('144px')}
                    onBlur={() => setHeight('50px')}
                />
                {streaming ? <Button className={'absolute right-5 bottom-7  '}
                                     type={'danger'} size={'sm'} icon='ri-stop-mini-fill'
                                     onClick={stopChat}/>
                    : <Button className={'absolute right-5 bottom-7  '}
                              type={'success'} size={'sm'} icon='ri-mail-send-fill'
                              onClick={() => sendMessage()}/>
                }

            </div>
        </div>
    )
}
export default Chat