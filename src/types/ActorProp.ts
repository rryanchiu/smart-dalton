import {ConfigurationProps} from "../stores/types/configuration";

export interface ActorProp {
    id: string
    title: string
    description: string
    icon?: string
    prefix?: string
    config?: ConfigurationProps
    content: string
}
