import {EventStreamContentType, fetchEventSource,} from "@microsoft/fetch-event-source";
import {ConfigurationProps} from "../stores/types/configuration.ts";


export interface RequestMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface OpenAIConfig {
    model: string;
    temperature?: number;
    top_p?: number;
    stream?: boolean;
    presence_penalty?: number;
    frequency_penalty?: number;
}

export interface OpenAIReq {
    messages: RequestMessage[];
    settings: ConfigurationProps;
    config: OpenAIConfig;
    // event
    onMessage?: (message: string, chunk: string) => void;
    onFinish: (message: string) => void;
    onError?: (err: Error) => void;
}

export interface OpenAIRes {
    error?: OpenAIErrorMsg;
}

export interface OpenAIErrorMsg {
    message?: string
    code?: string;
    param?: string;
    type?: string;
}

const chat = async (req: OpenAIReq) => {
    if (!req.settings.apikey) {
        return
    }
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        "Authorization": 'Bearer ' + req.settings.apikey.trim()
    };


    const messages = req.messages.map((v) => ({
        role: v.role,
        content: v.content,
    }));


    const requestBody = {
        messages,
        ...req.config
    };


    const controller = new AbortController();

    try {
        const chatPath = req.settings.baseUrl + "/v1/chat/completions";
        const chatPayload = {
            method: "POST",
            body: JSON.stringify(requestBody),
            signal: controller.signal,
            headers: headers,
        };

        // make a fetch request
        const requestTimeoutId = setTimeout(
            () => controller.abort(),
            60000,
        );

        let message = "";
        let finished = false;

        const close = () => {
            if (!finished) {
                req.onFinish(message);
                finished = true;
            }
        };

        controller.signal.onabort = close;

        fetchEventSource(chatPath, {
            ...chatPayload,
            async onopen(res) {
                clearTimeout(requestTimeoutId);
                const contentType = res.headers.get("content-type");
                if (contentType?.startsWith("text/plain")) {
                    message = await res.clone().text();
                    return close();
                }

                if (
                    !res.ok ||
                    !res.headers
                        .get("content-type")
                        ?.startsWith(EventStreamContentType) ||
                    res.status !== 200
                ) {
                    const responseMessages = [message];
                    const responseBody: string = await res.clone().text();
                    try {
                        const responseJson: OpenAIRes = await res.clone().json();
                        if (responseJson && responseJson.error) {
                            message = responseJson.error.message || 'Unknown error.';
                        }
                        return close();
                    } catch {
                        console.error('failed')
                    }
                    if (res.status === 401) {
                        responseMessages.push("认证失败");
                    }
                    if (res.status === 404) {
                        responseMessages.push("接口故障");
                    }

                    if (responseBody) {
                        responseMessages.push(responseBody)
                    }

                    message = responseMessages.join("\r\n");

                    return close();
                }
            },
            onmessage(msg) {
                if (msg.data === "[DONE]" || finished) {
                    return close();
                }
                const text = msg.data;
                try {
                    const json = JSON.parse(text);
                    const delta = json.choices[0].delta.content;
                    if (delta) {
                        message += delta;
                        req.onMessage?.(message, delta);
                    }
                } catch (e) {
                    console.error("[Request] parse error", text, msg);
                }
            },
            onclose() {
                close();
            },
            onerror(e) {
                req.onError?.(e);
                throw e;
            },
            openWhenHidden: true,
        });
    } catch (e) {
        console.error("failed to make a chat request", e);
        req.onError?.(e as Error);
    }
}

export {chat};
