import {db} from './db/i18n.ts'

import {action, atom} from "nanostores";
import {actors_en} from "../config/actors_en.tsx";
import {actors} from "../config/actors.tsx";


export const currentLanguage = atom('')
export const actorConfig = atom(actors_en)


export const getCurrentLanguage = async () => {
    let language = await db.getItem('currentLanguage')
    if (!language) {
        language = 'en_us'
        await db.setItem('currentLanguage', language)
    }
    return language;
}

export const switchLanguage = action(currentLanguage, 'switchLanguage', async (store, language) => {
    await db.setItem('currentLanguage', language)
    store.set(language)
    actorConfig.set(language == 'en_us' ? actors_en : actors)
})
