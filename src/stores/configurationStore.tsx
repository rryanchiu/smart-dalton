import {db} from './db/configurations.ts'

import type {ConfigurationProps} from "./types/configuration.ts";
import {action, atom, map} from "nanostores";

const defaultConfig: ConfigurationProps = {
    baseUrl: 'https://api.openai.com',
    apikey: '',
    actorId: 'no_actor',
    model: 'gpt-3.5-turbo',
    top_p: 0.8,
    temperature: 0.8,
    max_tokens: 1024,
    presence_penalty: 1,
    frequency_penalty: 1
}

export const configurationMap = map<Record<string, ConfigurationProps>>({})
//@ts-ignore
export const currentConfiguration = atom<ConfigurationProps>({})

export const initConfigurations = async () => {
    const data = await db.getMap() || {}
    configurationMap.set(data)
}

export const deleteConfiguration = async (conversationId: string) => {
    await db.deleteItem(conversationId)
}

export const getConfiguration = async (conversationId: string) => {
    const config = configurationMap.get()[conversationId]
    if (!config) {
        await saveConfiguration(conversationId, defaultConfig)
        await initConfigurations();
        return configurationMap.get()[conversationId];
    }
    return config;
}


export const saveConfiguration = action(
    configurationMap,
    'addConfiguration',
    (map, conversationId: string, config: ConfigurationProps) => {
        map.setKey(conversationId, config)
        db.setItem(conversationId, config)
    },
)

export const selectConfiguration = async (conversationId: string) => {
    const localConfig = await db.getItem(conversationId)
    if (!localConfig) {
        await saveConfiguration(conversationId, defaultConfig)
        await initConfigurations();
    }
    currentConfiguration.set(configurationMap.get()[conversationId])
}

