import {db} from './db/i18n.ts'

import {action, atom} from "nanostores";


export const currentLanguage = atom('')


export const getCurrentLanguage = async () => {
    let language = await db.getItem('currentLanguage')
    if (!language) {
        language = 'en_us'
        await db.setItem('currentLanguage',language)
    }
    return language;
}

export const switchLanguage = action(currentLanguage, 'switchLanguage', async (store, language) => {
    await db.setItem('currentLanguage', language)
    currentLanguage.set(language)
})
