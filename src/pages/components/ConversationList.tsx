import {Button} from "../ui";
import {useStore} from '@nanostores/react'

import {
    conversations,
    currentConversationId,
    fetchData,
    updateConversation,
    addConversation,
    selectConversation,
    deleteConversation
} from "../../stores/conversationStore.tsx"

import {useEffect, useState} from "react";
import {ConversationProps} from "../../stores/types/conversation.ts";
import {configurations, getConfiguration} from "../../stores";

const ConversationList =  () => {
    const conversation = useStore(conversations)
    const conversationId = useStore(currentConversationId)

    const reloadConfig = async () => {
        console.log('conversationId changed', conversationId)
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
        conversations.set(await fetchData());
    }

    const hideSide = () => {
        const element = document.getElementById("side-l");
        if (element != null) {
            element.classList.remove('side-show');
        }
    }


    const updateConversationTitle = async (newTitle: string, item: ConversationProps) => {
        console.log(newTitle)
        const data: ConversationProps = {...item, title: newTitle}
        setEditingId('')
        await updateConversation(data);
        conversations.set(await fetchData());
    }

    return (
        <div className={'h-full flex flex-col'}>
            <header className='header'>
                <span className="pagetitle font-700 ml2">Dalton</span>
                <div className={'flex gap-1.5'}>
                    <Button icon={'ri-add-line'} text={'New'} onClick={newConversation}/>
                    <Button className='autoshow' icon={'ri-close-line'} onClick={hideSide}/>
                </div>
            </header>
            <div className={"list grow"}>
                {conversation.map((item,index) => (
                    <div key={index}
                        className=
                             {['listitem flex justify-between gap-1.5',
                                 conversationId === item.id ? 'selected' : '',
                             ].join(' ')}
                         onClick={() => {
                             selectConversation(item.id);
                         }}>
                        {editingId !== item.id && <div>{item.title}</div>
                        }
                        {editingId === item.id &&
                            <input className={"bg-white dark:bg-dark px2 py0 rd-2 w-[160px]"}
                                   value={editValue}
                                   onChange={(e) => setEditValue(e.target.value)}
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