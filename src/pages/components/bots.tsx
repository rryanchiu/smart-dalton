const bots = {
    OpenAI: {
        enabled: true,
        params: [
            {field: 'baseUrl', defaultValue: 'https://api.openai.com', label: 'Base URL', type: 'text', placeholder: ''},
            {field: 'apikey', defaultValue: '', label: 'API Key', type: 'text', placeholder: ''},
            {
                field: 'model',
                label: 'model',
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
                    {value: 'gpt-3.5-turbo-16k-0613', label: 'gpt-3.5-turbo-16k-0613'},]
            },
            {
                field: 'temperature', label: 'temperature', type: 'number', defaultValue: 0.8,
                tips:'数值越大，答案越随机',
                step: 0.1,
            },
            {
                field: 'top_p', label: 'top_p', type: 'number', defaultValue: 1.0,
                tips:'数值越大，回答越多样',
                step: 0.1,
            },
            {field: 'max_tokens', label: 'max_tokens', type: 'number', defaultValue: 2048, min: 0, max: 10000},
            {
                field: 'presence_penalty',
                label: 'presence_penalty',
                type: 'number',
                defaultValue: 0.8,
                step: 0.1,
                min: -2.0,
                max: 2.0,
                tips: '数值越大，越有可能讨论到新话题'
            },
            {
                field: 'frequency_penalty',
                label: 'frequency_penalty',
                type: 'number',
                step: 0.1,
                defaultValue: 0.8,
                min: -2.0,
                max: 2.0,
                tips: '数值越大，重复的字数越低'
            }
        ]
    }
}
export default bots;