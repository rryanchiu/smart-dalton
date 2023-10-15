import {db} from './db/configurations.ts'

import type {ConfigurationProps} from "./types/configuration.ts";
import {atom} from "nanostores";

const defaultConfig = () => {
    return {
        apikey: '',
        model: 'gpt-3.5-turbo',
        top_p: 0.8,
        temperature: 0.8,
        max_tokens: 1024,
        presence_penalty: 1,
        frequency_penalty: 1
    }
}

export const configurations = atom<ConfigurationProps>({})

export const getDefaultConfig = async () => {
    const localConfig = await db.getItem('default')
    if (localConfig) {
        return localConfig;
    }
    return defaultConfig();
}

export const saveConfiguration = async (key: string, config: ConfigurationProps) => {
    await db.setItem(key, config)
}

export const deleteConfiguration = async (key: string) => {
    await db.deleteItem(key)
}

export const getConfiguration = async (key: string) => {
    const conf = await db.getItem(key)
    if (!conf) {
        const defaultConf = await getDefaultConfig();
        await db.setItem(key, defaultConf)
        return defaultConf
    }
    return conf;
}

export const switchConversation = async (cid:string) => {
    const localConfig = await db.getItem(cid)
    if (!localConfig) {
        const defaultConfig = await getDefaultConfig()
        db.setItem(cid, defaultConfig)
        configurations.set(defaultConfig)
    } else {
        configurations.set(localConfig)
    }
}

