import {MessageProps} from "../../stores/types/message.ts";
import {useI18n} from "../../hooks";
import Markdown from "./Markdown.tsx";
import {useEffect, useRef} from "react";

interface MessageViewerProps {
    messages: MessageProps[]
    streaming: boolean
    streamingMessage: string
}

const MessageViewer = (props: MessageViewerProps) => {
    const messages = props.messages || []
    const steamingMessage = props.streamingMessage || ''
    const streaming = props.streaming || false
    const {t} = useI18n()
    const messageRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        const dom = messageRef.current;
        if (dom) {
            requestAnimationFrame(() => {
                dom.scrollTo(0, dom.scrollHeight);
            });
        }
    }
    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
        }, 300)
    }, [messages, steamingMessage]);

    return (

        <div className="relative h-full overflow-x-none overflow-y-auto ">
            <div className={'flex  h-full  gap-1.5 '}>
                {messages.length <= 0 ?
                    <div className={'card m-auto color-gray-4 dark:color-gray-2 text-sm font-500 gap-1.2'}>
                        <span>{t('tips')}</span>
                        <span>{t('tipsline1')}</span>
                        <span>{t('tipsline2')}</span>
                    </div>
                    : <div ref={messageRef} className={'chatbox'}>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                {msg.role === 'dalton' &&
                                    <div
                                        className={'chatitem dark:color-red-1 bg-red-100 dark-bg-dark-3 dark-color-red-1 py-2  text-[16px]'}>
                                        <span>{msg.content}</span>
                                    </div>}
                                {msg.role === 'user' &&
                                    <div
                                        className={'chatitem dark:color-gray-2 py-2  text-[16px]'}>
                                        <span>{msg.content}</span>
                                    </div>}
                                {msg.role === 'assistant' &&
                                    <div
                                        className={'chatitem  break-words group bg-gray-1 dark:bg-dark-3 dark:color-gray-2'}>
                                        {/*<pre>{formatText(msg.content || '')} </pre>*/}
                                        <Markdown markdown={msg.content}/>
                                    </div>}
                            </div>
                        ))}
                        <div
                            className={'chatitem  break-words group bg-gray-1 dark:bg-dark-3 dark:color-gray-2 overflow-hidden relative inline-table'}
                            style={{display: streaming ? '' : 'none'}}>
                            {
                                steamingMessage ?
                                    <Markdown markdown={steamingMessage}/> :
                                    <div className={' w-full h-full  flex '}>
                                        <div className={'gradient-effect'}></div>
                                        <span className={'color-gray-4 '}>
                            {t('thinking')}</span>
                                    </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
export default MessageViewer;