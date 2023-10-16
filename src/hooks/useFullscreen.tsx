import {useEffect, useState} from "react";

export const useFullscreen = () => {

    const [fullscreen, setFullscreen] = useState<string>('')


    useEffect(() => {
        const localFullscreen = localStorage.getItem('fullscreen')
        setFullscreen(localFullscreen || 'true')
    }, [])

    useEffect(() => {
        if (fullscreen === undefined || fullscreen === '') {
            return;
        }

        const container = document.getElementById('container')
        const layout = document.getElementById('layout')
        if (!container || !layout) {
            return
        }

        localStorage.setItem('fullscreen', fullscreen)
        if (fullscreen === 'true') {
            container.classList.add('fullscreen')
            layout.classList.add('fullscreenlayhout')
        } else {
            container.classList.remove('fullscreen')
            layout.classList.remove('fullscreenlayhout')
        }
    }, [fullscreen])


    return [fullscreen, setFullscreen] as const
}