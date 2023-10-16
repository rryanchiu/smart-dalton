//@ts-ignore
import {toast} from 'react-toastify';
import bots from "./bots.tsx";

// import {toast} from 'react-toastify';
import {useTheme} from '../../hooks'
import {Button} from "../ui";
import {configurations, currentConversationId, currentLanguage, saveConfiguration, switchLanguage} from "../../stores";
import {useStore} from "@nanostores/react";
import {useEffect} from "react";
import {useI18n} from "../../hooks/useI18n.tsx";
import {ConfigurationProps} from "../../stores/types/configuration.ts";


interface BotDetail {
    field: string
    label: string
    type: string
    options?: string,
    defaultValue?: string
    tips?: string
    step?: number
    placeholder?: string
}

interface BotItemProp {
    init: BotDetail,
    data: ConfigurationProps,
    changeValue: (v: string | number | boolean | object) => void
}

const Item = (props: BotItemProp) => {

    const {init, data} = props
    const field = init.field;
    const getDataFieldValue = () => {
        //@ts-ignore
        return data[field] || ''
    }
    return (
        <div className="p1">
            <div className="mb1 color-gray gap-1.2 flex justify-between">{init.label}
                {init.tips && <i className={'ri-question-line text-[15px]'} title={init.tips}> </i>}</div>

            {init.type === 'text' && <input className={'bg-gray-1 p1 pl3 pr3 rd w-full dark:bg-dark-1'} type="text"
                //@ts-ignore
                                            value={getDataFieldValue() ? data[field] : ''}
                                            autoComplete={'off'}
                //@ts-ignore
                                            onChange={e => props.changeValue(field, e.currentTarget.value)}
                                            placeholder={init.placeholder}/>}
            {init.type === 'number' && <input className={'bg-gray-1 p1 pl3 pr3 rd w-full dark:bg-dark-1'} type="number"
                //@ts-ignore
                                              value={data[field] ? data[field] : init.defaultValue}
                                              autoComplete={'off'}
                                              step={init.step ? init.step : 1}
                //@ts-ignore
                                              onChange={e => props.changeValue(field, e.currentTarget.value)}
                                              placeholder={init.placeholder}/>}
            {init.type === 'select' &&
                <select className={'select bg-gray-1 p1 pl3 pr3 rd w-full dark:bg-dark-1'}
                    //@ts-ignore
                        value={data[field] ? data[field] : init.defaultValue}
                    //@ts-ignore
                        onChange={e => props.changeValue(field, e.target.value)}>

                    {//@ts-ignore
                        init.options.map((item, index) => (
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
    const $currentLanguage = useStore(currentLanguage)
    const conversationId = useStore(currentConversationId)

    const {t} = useI18n()

    useEffect(() => {
        configurations.set(configuration)
    }, [configuration])

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
        const c: ConfigurationProps = {};
        Object.assign(c, configuration);
        //@ts-ignore
        c[field] = value
        configurations.set(c)

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
    }
    return (
        <div className={'h-full flex flex-col'}>
            <header className='header'>
                <b>{t('settings')}</b>
                <Button className="autoshow" onClick={hideSide} icon={'ri-close-line'}/>
            </header>
            <div className="h-full px2 py2 overflow-x-hidden overflow-y-auto text-sm">
                <div className="font-700 m1">OpenAI</div>
                <div className="flex flex-col ">
                    {bots.OpenAI.params.map((item, index: number) => (
                        //@ts-ignore
                        <Item key={index} init={item} data={configuration} changeValue={changeValue}/>
                    ))}
                </div>

            </div>
            <div className=" bottom-2 left-2 p3 flex justify-between">
                <div className={'flex gap-1.5'}>
                    <Button icon={theme == 'light' ? 'ri-moon-line' : 'ri-sun-line'} onClick={switchTheme}
                            title={theme == 'light' ? 'Switch to dark' : 'Switch to light'}/>
                    <Button icon='ri-translate' onClick={() => {
                        switchLanguage($currentLanguage === 'zh_cn' ? 'en_us' : 'zh_cn');
                    }}/>
                    <Button text={'😀'} onClick={() => {
                        window.open('https://rryan.me');
                    }}/>
                </div>
                <Button icon='ri-check-line' type={'success'} onClick={saveConfig}
                        text={t('save')}
                        className={' right-3'}/>
            </div>
        </div>
    )
}
export default SettingPanel