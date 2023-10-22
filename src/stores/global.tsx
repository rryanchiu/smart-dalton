import {atom} from "nanostores";

export const abortController = atom<AbortController | null>(null)
export const initActor = atom(false)
