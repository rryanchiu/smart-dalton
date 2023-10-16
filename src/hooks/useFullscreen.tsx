import {useEffect, useState} from "react";

export const useFullscreen = () => {
    const [fullscreen, setFullscreen] = useState<boolean>(null)


    useEffect(() => {
        const localFullscreen = localStorage.getItem('fullscreen')
        setFullscreen(localFullscreen === 'true')
    }, [])

    useEffect(() => {
        // document.documentElement.classList.toggle('dark', theme == 'dark')
        if (fullscreen === null) {
            return;
        }
        const container = document.getElementById('container')
        const layout = document.getElementById('layout')
        if (!container ||!layout) {
            return
        }

        localStorage.setItem('fullscreen', fullscreen ? 'true' : 'false')
        if (fullscreen) {
            container.classList.add('fullscreen')
            layout.classList.add('fullscreenlayhout')
        } else {
            container.classList.remove('fullscreen')
            layout.classList.remove('fullscreenlayhout')
        }
    }, [fullscreen])


    return [fullscreen, setFullscreen] as const
}