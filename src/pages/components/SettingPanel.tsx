import {toast} from 'react-toastify';
import openAIParam from "./bots.tsx";
import {useTheme} from '../../hooks'
import {Button, Input} from "../ui";
import {
    actorConfig,
    currentConfiguration,
    currentConversationId,
    currentLanguage,
    saveConfiguration,
    switchLanguage
} from "../../stores";
import {useStore} from "@nanostores/react";
import {useI18n} from "../../hooks/useI18n.tsx";
import {CardSelect} from "../ui/CardSelect.tsx";
import {initActor} from "../../stores/global.tsx";

const SettingPanel = () => {
    const [theme, setTheme] = useTheme()
    const $currentLanguage = useStore(currentLanguage)
    const conversationId = useStore(currentConversationId)
    const $actorConfig = useStore(actorConfig)
    const configuration = useStore(currentConfiguration)

    const initActorStatus = useStore(initActor);
    const changeCurrentActorId = (e: any) => {
        changConfigValues('actorId', e.currentTarget.id)
    }

    const {t} = useI18n()

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

    const changConfigValues = (field: string, value: string | number | boolean | object) => {
        const newData = {...configuration};
        //@ts-ignore
        newData[field] = value
        currentConfiguration.set(newData)
    }
    const saveConfig = () => {
        saveConfiguration(conversationId, configuration)
        toast(t('savesucceed'), {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: theme == 'light' ? "light" : 'dark'
        });
        if (!initActorStatus) {
            initActor.set(true)
        }
    }
    return (
        <div className={'h-full flex flex-col dark:color-gray-3'}>
            <header className='header'>
                <b>{t('settings')}</b>
                <Button className="autoshow" onClick={hideSide} icon={'ri-close-line'}/>
            </header>
            <div className="h-full px2 py2 overflow-x-hidden overflow-y-auto text-sm">
                <div className="font-700 m1 ">OpenAI</div>
                <div className={' p2'} style={{display: 'none'}}>
                    <div className={'flex flex-col py-2 pb-[0.2rem]'}>
                        <div className={'flex mb2 justify-between'}>
                            <span className={'color-gray-6 dark:color-gray-1'}>{t('actor')}</span>
                        </div>
                        <CardSelect value={configuration["actorId"]} onChange={changeCurrentActorId}
                                    options={$actorConfig}/>
                    </div>
                </div>
                <div className="flex flex-col px-2">
                    {openAIParam.map((item, index: number) => (
                        <Input key={index}
                               showValue={item.showValue}
                               type={item.type}
                               step={item.step}
                               max={item.max}
                               min={item.min}
                               options={item.options}
                               title={item.label}
                               tips={t('tips_' + item.field)}
                            //@ts-ignore
                               value={configuration[item.field]}
                               onChange={(e) => {
                                   //@ts-ignore
                                   const val = item.type === 'range' ? Number(e.currentTarget.value).toFixed(1) : e.currentTarget.value;
                                   changConfigValues(item.field, val);
                               }}
                               placeholder={item.placeholder}/>
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