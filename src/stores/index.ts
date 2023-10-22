import {initMessageStore} from "./messageStore.tsx";
import {initConversations} from "./conversationStore.tsx";
import {initConfigurations} from "./configurationStore.tsx";

export * from './configurationStore.tsx'
export * from './conversationStore.tsx'
export * from './messageStore.tsx'
export * from './i18nStore.tsx'

export const initStores = async () => {
    await initConfigurations()
    await initMessageStore()
    await initConversations();
}

initStores();