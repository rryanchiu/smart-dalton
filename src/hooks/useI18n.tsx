import {en_us} from '../locales/en_us.ts'
import {currentLanguage, getCurrentLanguage, switchLanguage} from '../stores/i18nStore.tsx'
import {useEffect, useState} from "react";
import {zh_cn} from "../locales/zh_cn.ts";


export const useI18n = () => {
    const [currentLocale, setCurrentLocale] = useState(en_us)

    currentLanguage.listen((value) => {
        setCurrentLocale(value === 'zh_cn' ? zh_cn : en_us)
        switchLanguage(value)
    })

    const init = async () => {
        const language = await getCurrentLanguage()
        setCurrentLocale(language === 'zh_cn' ? zh_cn : en_us)
    };
    useEffect(() => {
        init()
    }, []);

    const t = (key: string) => {
        return currentLocale ? currentLocale[key] : ''
    }

    return {currentLocale, setCurrentLocale, t}
}

