import {toast} from 'react-toastify';

2
import bots from "./bots.tsx";

// import {toast} from 'react-toastify';
import {useTheme} from '../../hooks'
import {Button} from "../ui";
import {currentConversationId, configurations, saveConfiguration, conversations} from "../../stores";
import {useStore} from "@nanostores/react";
import {useEffect} from "react";


interface BotItemProp {
    init: {
        field: string
        label: string
        type: string
        options?: string,
        defaultValue?: string
        tips?: string
        step?: number
        placeholder?: string
    },
    data: object,
    changeValue: (v: string | number | boolean | object) => void
}

const Item = (props: BotItemProp) => {

    const {init, data} = props
    const field = init.field;

    return (
        <div className="p1">
            <div className="mb1 color-gray">{init.label}</div>
            {init.type === 'text' && <input className={'bg-gray-1 p1 pl3 pr3 rd w-full dark:bg-dark-1'} type="text"
                                            value={data[field] ? data[field] : ''}
                                            autoComplete={'off'}
                                            onChange={e => props.changeValue(field, e.currentTarget.value)}
                                            placeholder={init.placeholder}/>}
            {init.type === 'number' && <input className={'bg-gray-1 p1 pl3 pr3 rd w-full dark:bg-dark-1'} type="number"
                                              value={data[field] ? data[field] : init.defaultValue}
                                              autoComplete={'off'}
                                              step={init.step ? init.step : 1}
                                              onChange={e => props.changeValue(field, e.currentTarget.value)}
                                              placeholder={init.placeholder}/>}
            {init.type === 'select' &&
                <select className={'select bg-gray-1 p1 pl3 pr3 rd w-full dark:bg-dark-1'}
                        value={data[field] ? data[field] : init.defaultValue}
                        onChange={e => props.changeValue(field, e.target.value)}>
                    {init.options.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            }
        </div>
    )
}

const SettingPanel = () => {
    const [theme, setTheme] = useTheme()
    const configuration = useStore(configurations)
    const conversationId = useStore(currentConversationId)

    useEffect(()=>{
        configurations.set(configuration)
    },[configuration])

    const switchTheme = () => {
        const t = theme === 'dark' ? 'light' : 'dark'
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t)
        setTheme(t)
    }

    const hideSide = () => {
        const element = document.getElementById("side-r");
        if (element != null) {
            element.classList.remove('side-show');
        }
    }

    const changeValue = (field: string, value: object) => {
        const c = {};
        Object.assign(c, configuration);
        c[field] = value
        configurations.set(c)
        console.log('changeValue ' + field, value)
    }

    const saveConfig = () => {
        saveConfiguration(conversationId, configuration)
        toast('😉保存成功', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark'
        });
        console.log('save config', conversationId);
        console.log('save config', JSON.stringify(configuration));
    }
    return (
        <div className={'h-full flex flex-col'}>
            <header className='header'>
                <b>Settings</b>
                <Button className="autoshow" onClick={hideSide} icon={'ri-close-line'}/>
            </header>
            <div className="h-full px2 mt-2 overflow-x-hidden overflow-y-auto text-sm">
                <div className="font-700 m1">OpenAI</div>
                {/*<div className="flex flex-col p1 border-b pb5 mb3">*/}
                {/*    <div className="mb1 color-gray">用户设定</div>*/}
                    {/*<Button icon={'ri-settings-line'} size={'sm'}></Button>*/}
                    {/*<input className={'bg-gray-1 p1 pl3 pr3 rd w-full dark:bg-dark-1'} type="text"*/}
                    {/*       value={''}*/}
                    {/*       autoComplete={'off'}*/}
                    {/*       placeholder={'自定义用户设定'}/>*/}
                {/*</div>*/}
                <div className="flex flex-col ">
                    {bots.OpenAI.params.map((item,index) => (
                        <Item key={index} init={item} data={configuration} changeValue={changeValue}/>
                    ))}
                </div>

            </div>
            <div className=" bottom-2 left-2 p3 flex justify-between">
                <div className={'flex gap-1.5'}>
                    <Button icon={theme == 'light' ? 'ri-moon-line' : 'ri-sun-line'} onClick={switchTheme}
                            title={theme == 'light' ? 'Switch to dark' : 'Switch to light'}/>
                    <Button icon='ri-translate'/>
                </div>
                <Button icon='ri-check-line' text={'Save'} type={'success'} onClick={saveConfig}
                        className={' right-3'}/>
            </div>
        </div>
    )
}
export default SettingPanel