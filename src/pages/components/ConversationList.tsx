import {Button} from "../ui";
import {useStore} from '@nanostores/react'

import {
    addConversation,
    conversations,
    currentConversationId,
    deleteConversation,
    fetchData,
    selectConversation,
    updateConversation
} from "../../stores/conversationStore.tsx"

import {useI18n} from '../../hooks'
import {useEffect, useState} from "react";
import {ConversationProps} from "../../stores/types/conversation.ts";
import {configurations, getConfiguration} from "../../stores";

const ConversationList = () => {
    const conversation = useStore(conversations)
    const conversationId = useStore(currentConversationId)
    const {t} = useI18n();
    const reloadConfig = async () => {
        configurations.set(await getConfiguration(conversationId))
    }

    useEffect(() => {
        reloadConfig()
    }, [conversationId])

    const [editingId, setEditingId] = useState('')
    const [editValue, setEditValue] = useState('')
    const newConversation = async () => {
        const data = await addConversation();
        currentConversationId.set(data.id)
    }
    const delConversation = async (id: string) => {
        await deleteConversation(id);
        if (conversations.get().length <= 0) {
            await addConversation()
        }
        conversations.set(await fetchData());
        selectConversation(conversations.get()[0].id)
    }

    const hideSide = () => {
        const element = document.getElementById("side-l");
        if (element != null) {
            element.classList.remove('side-show');
        }
    }


    const updateConversationTitle = async (newTitle: string, item: ConversationProps) => {
        const data: ConversationProps = {...item, title: newTitle}
        setEditingId('')
        await updateConversation(data);
        conversations.set(await fetchData());
    }


    return (
        <div className={'h-full flex flex-col'}>
            <header className='header'>
                <div className={'flex items-center gap-0'}>
                    <img src="/dalton.svg" alt="" className={'w-7.5'}/>
                    <span className="pagetitle font-700 ml2 color-dark-2 dark:color-gray-1 ">Dalton</span>
                </div>
                <div className={'flex gap-1.5 text-sm'}>
                    <Button icon={'ri-add-line'} text={t('newconversation')} onClick={newConversation}/>
                    <Button className='autoshow' icon={'ri-close-line'} onClick={hideSide}/>
                </div>
            </header>
            <div className={"list grow "}>
                {conversation.map((item, index) => (
                    <div key={index}
                         className=
                             {['listitem flex justify-between gap-1.5 text-sm items-center ',
                                 conversationId === item.id ? 'selected' : '',
                             ].join(' ')}
                         onClick={() => {
                             selectConversation(item.id);
                         }}>
                        {editingId !== item.id &&
                            <div className={'line-height-[30px]'}>{item.title || t('conversationname')}</div>
                        }
                        {editingId === item.id &&
                            <input className={"bg-white dark:bg-dark px2 py1 rd-2 w-[160px]"}
                                   value={editValue}
                                   //@ts-ignore
                                   onInput={(e) =>{ setEditValue(e.target.value)}}
                            />}

                        {editingId === item.id &&
                            <div className={'flex gap-1'}>
                                <Button className={'suffixbtn hidden'} icon={'ri-check-line'} size={"sm"}
                                        onClick={() => {
                                            updateConversationTitle(editValue, item)
                                        }}
                                />
                                <Button className={'suffixbtn hidden'} icon={'ri-close-line'} size={"sm"}
                                        onClick={() => setEditingId('')}/>
                            </div>
                        }
                        {editingId !== item.id &&
                            <div className={'flex gap-1'}>
                                <Button className={'suffixbtn hidden'} icon={'ri-edit-line'} size={"sm"}
                                        onClick={() => {
                                            setEditingId(item.id);
                                            setEditValue(item.title || '');
                                        }}/>
                                <Button className={'suffixbtn hidden'} icon={'ri-close-line'} size={"sm"}
                                        onClick={() => delConversation(item.id)}/>

                            </div>
                        }

                    </div>
                ))
                }
            </div>
            <footer className="p5 text-sm color-gray-3  bottom-2 left-[10px] w-full gap-1.5">
                <a href="https://rryan.me" target="_blank">Ryan</a> © 2023 | <a href="https://github.com/rryanchiu"
                                                                                target="_blank">Github</a>
            </footer>
        </div>
    )
}
export default ConversationList