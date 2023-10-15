import {EventStreamContentType, fetchEventSource,} from "@microsoft/fetch-event-source";

import {useStore} from '@nanostores/react'
import {configurations} from "../stores";
import {ConfigurationProps} from "../stores/types/configuration.ts";

export interface OpenAIListModelResponse {
    object: string;
    data: Array<{
        id: string;
        object: string;
        root: string;
    }>;
}


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

    onUpdate?: (message: string, chunk: string) => void;
    onFinish: (message: string) => void;
    onError?: (err: Error) => void;
    onController?: (controller: AbortController) => void;
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


    const requestPayload = {
        messages,
       ...req.config
    };

    console.log("[Request] openai payload: ", JSON.stringify(requestPayload));

    const shouldStream = !!req.config.stream;
    const controller = new AbortController();
    req.onController?.(controller);

    try {
        const chatPath = "https://api.openai.com/v1/chat/completions";
        const chatPayload = {
            method: "POST",
            body: JSON.stringify(requestPayload),
            signal: controller.signal,
            headers: headers,
        };

        // make a fetch request
        const requestTimeoutId = setTimeout(
            () => controller.abort(),
            60000,
        );

        if (shouldStream) {
            let responseText = "";
            let finished = false;

            const finish = () => {
                if (!finished) {
                    req.onFinish(responseText);
                    finished = true;
                }
            };

            controller.signal.onabort = finish;

            fetchEventSource(chatPath, {
                ...chatPayload,
                async onopen(res) {
                    clearTimeout(requestTimeoutId);
                    const contentType = res.headers.get("content-type");
                    if (contentType?.startsWith("text/plain")) {
                        responseText = await res.clone().text();
                        return finish();
                    }

                    if (
                        !res.ok ||
                        !res.headers
                            .get("content-type")
                            ?.startsWith(EventStreamContentType) ||
                        res.status !== 200
                    ) {
                        const responseTexts = [responseText];
                        let extraInfo = await res.clone().text();
                        try {
                            const resJson = await res.clone().json();
                            // extraInfo = prettyObject(resJson);
                            extraInfo = resJson;
                        } catch {
                            console.error('failed')
                        }

                        if (res.status === 401) {
                            responseTexts.push("认证失败");
                        }

                        if (extraInfo) {
                            responseTexts.push(extraInfo);
                        }

                        responseText = responseTexts.join("\n\n");

                        return finish();
                    }
                },
                onmessage(msg) {
                    if (msg.data === "[DONE]" || finished) {
                        return finish();
                    }
                    const text = msg.data;
                    try {
                        const json = JSON.parse(text);
                        const delta = json.choices[0].delta.content;
                        if (delta) {
                            responseText += delta;
                            req.onUpdate?.(responseText, delta);
                        }
                    } catch (e) {
                        console.error("[Request] parse error", text, msg);
                    }
                },
                onclose() {
                    finish();
                },
                onerror(e) {
                    req.onError?.(e);
                    throw e;
                },
                openWhenHidden: true,
            });
        } else {
            const res = await fetch(chatPath, chatPayload);
            clearTimeout(requestTimeoutId);

            const resJson = await res.json();
            const message = resJson.choices?.at(0)?.message?.content
            req.onFinish(message);
        }
    } catch (e) {
        console.error("failed to make a chat request", e);
        req.onError?.(e as Error);
    }
}

export {chat};
