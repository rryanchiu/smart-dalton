import React, {useEffect} from 'react'
import {Button} from "../ui";

import {
    currentConversationId,
    conversations
} from "../../stores/conversationStore.tsx"

import {useStore} from '@nanostores/react'
import {chat, OpenAIConfig, RequestMessage} from "../../utils/openai.tsx";
import {configurations, addMessage} from "../../stores";
import {MessageProps} from "../../stores/types/message.ts";
import {getMessagesByConversationId} from "../../stores/messageStore.tsx"

const Chat = () => {
    const [inputValue, setInputValue] = React.useState('')
    const conversationId = useStore(currentConversationId);
    const conversation = useStore(conversations);
    const conf = useStore(configurations)
    const [height, setHeight] = React.useState('50px');
    const [steamingMessage, setStreamingMessage] = React.useState('');
    const [streaming, setStreaming] = React.useState(false);

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
                return item.title;
            }
        }
        return cid;

    }
    const showSide = (elementId: string) => {
        const element = document.getElementById(elementId);
        if (element !== null) {
            element.classList.add('side-show');
        }
    }
    const addMsg = (role: 'user' | 'assistant' | 'system', message: string) => {
        const rowId = 'id_' + Date.now()
        const messageBody: MessageProps = {
            id: rowId,
            conversationId: conversationId,
            messageId: '',
            createTime: Date.now(),
            role: role,
            content: message
        }
        addMessage(conversationId, messageBody)
    }
    const sendMessage = () => {
        setStreaming(true)
        const sendMessages: RequestMessage[] = [];
        sendMessages.push({
            role: 'user',
            content: inputValue
        })
        addMsg('user', inputValue)
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
            onUpdate(message) {
                // botMessage.streaming = true;
                // if (message) {
                //     botMessage.content = message;
                // }
                // get().updateCurrentSession((session) => {
                //     session.messages = session.messages.concat();
                // });
                console.log(message)
                setStreamingMessage(message)
            },
            onFinish(message) {
                addMsg('assistant', message)
                console.log('finish', message)
                init()
                setStreaming(false)
            },
            onError(error) {
                console.log(error)
                init()
                setStreaming(false)
            }
        })
    }
    return (
        <div className={'h-full flex flex-col'}>
            <header className='header'>
                <div className={"flex gap-1.5 items-center"}>
                    <Button className={'autoshow'} icon='ri-menu-line'
                            onClick={() => showSide('side-l')}/>
                    <b>{getConversationName(conversationId)}</b></div>
                <div className={"flex gap-1.5"}>
                    <Button icon='ri-eraser-line'/>
                    <Button className={'autoshow'} icon='ri-settings-4-line' onClick={() => showSide('side-r')}/>
                </div>
            </header>
            <div style={{flex: '1 1'}} className="relative h-full overflow-x-none overflow-y-auto ">
                <div className={'flex  h-full w-full gap-1.5 '}>
                    {messages.length <= 0 ?
                        <div className={'card m-auto color-gray-6 dark:color-gray-2 text-sm font-500 gap-1.2'}>
                            <span>✨本服务需要OpenAI API Key才能访问</span>
                        </div>
                        : <div className={'chatbox'}>
                            {messages.map((msg, index) => (
                                <div  >
                                    {msg.role === 'user' &&
                                        <div key={index}
                                             className={'chatitem bg-white'}>
                                            <span>{msg.content}</span>
                                        </div>}
                                    {msg.role === 'assistant' &&
                                        <div key={index}
                                             className={'chatitem bg-gray-1'}>
                                            <span>{msg.content}</span>
                                        </div>}
                                </div>
                            ))}
                            <div
                                className={'chatitem bg-gray-1'}
                                style={{display: streaming ? '' : 'none'}}>
                                {
                                    steamingMessage ? <span>{steamingMessage}</span> :
                                        <span className={'color-gray-3'}>Thinking...</span>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div style={{position: 'sticky'}} className="absolute bottom-0 w-full border-t-1 p3 dark:border-dark-1">
                  <textarea
                      id='inputtext'
                      className={'chattext inputtext resize-none'}
                      style={{height: height}}
                      disabled={streaming}
                      placeholder={streaming ? 'Thinking...' : 'Ask me anything😀'}
                      value={inputValue}
                      onChange={handleTextareaChange}/>
                {/*<Button className="absolute left-5 bottom-7  "*/}
                {/*        type={'normal'} size={'sm'} icon='ri-image-line' onClick={() => sendMessage()}/>*/}
                <Button className={'absolute right-5 bottom-7 '}
                        disabled={streaming}
                        type={'normal'} size={'sm'} icon='ri-send-plane-line' onClick={() => sendMessage()}/>
            </div>
        </div>
    )
}
export default Chat