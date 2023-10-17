export interface OptionKeyValue {
    label: string
    value: string
}

export interface BotDetail {
    field: string
    label: string
    type: 'text' | 'range' | 'select'
    showValue: boolean
    options?: OptionKeyValue[],
    defaultValue?: string | number | boolean
    tips?: string
    step?: number
    min?: number
    max?: number
    placeholder?: string
}

const openAIParam: BotDetail[] = [
    {
        field: 'baseUrl',
        defaultValue: 'https://api.openai.com',
        label: 'Base URL',
        type: 'text',
        placeholder: '',
        showValue: false
    },
    {field: 'apikey', defaultValue: '', label: 'API Key', type: 'text', placeholder: '', showValue: false},
    {
        field: 'model',
        label: 'Model',
        type: 'select',
        options: [
            {value: 'gpt-3.5-turbo', label: 'gpt-3.5-turbo'},
            {value: 'gpt-4', label: 'gpt-4'},
            {value: 'gpt-4-0314', label: 'gpt-4-0314'},
            {value: 'gpt-4-0613', label: 'gpt-4-0613'},
            {value: 'gpt-4-32k', label: 'gpt-4-32k'},
            {value: 'gpt-4-32k-0314', label: 'gpt-4-32k-0314'},
            {value: 'gpt-4-32k-0613', label: 'gpt-4-32k-0613'},
            {value: 'gpt-3.5-turbo-0301', label: 'gpt-3.5-turbo-0301'},
            {value: 'gpt-3.5-turbo-0613', label: 'gpt-3.5-turbo-0613'},
            {value: 'gpt-3.5-turbo-16k', label: 'gpt-3.5-turbo-16k'},
            {value: 'gpt-3.5-turbo-16k-0613', label: 'gpt-3.5-turbo-16k-0613'},], showValue: false
    },
    {
        field: 'temperature', label: 'Temperature', type: 'range', defaultValue: 0.8,
        max: 2,
        min: 0,
        tips: '数值越大，答案越随机',
        step: 0.1, showValue: true
    },
    {
        field: 'top_p', label: 'Top P', type: 'range', defaultValue: 1.0,
        tips: '数值越大，回答越多样',
        max: 1, min: 0,
        step: 0.01, showValue: true
    },
    {
        field: 'max_tokens', label: 'Max Tokens', type: 'range', defaultValue: 2048, min: 0, max: 10000,
        showValue: true,
        tips: '限制生成的标记数，从而限制输出长度'
    },
    {
        field: 'presence_penalty',
        label: 'Presence Penalty',
        type: 'range',
        defaultValue: 0.8,
        step: 0.01,
        min: -2.0,
        max: 2.0,
        tips: '数值越大，越有可能讨论到新话题', showValue: true
    },
    {
        field: 'frequency_penalty',
        label: 'Frequency Penalty',
        type: 'range',
        step: 0.01,
        defaultValue: 0.8,
        min: -2.0,
        max: 2.0,
        tips: '数值越大，重复的字数越低', showValue: true
    }
]
export default openAIParam;