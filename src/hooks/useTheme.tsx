import {useEffect, useState} from "react";

export const useTheme = () => {
    const [theme, setTheme] = useState('')

    const listen = () => {
        const colorSchema = window.matchMedia('(prefers-color-scheme: dark)')
        colorSchema.addEventListener('change', () => {
            // document.documentElement.classList.toggle('dark', colorSchema.matches)
            if (theme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        })
    }

    useEffect(() => {
        const localTheme = localStorage.getItem('theme')
        if (localTheme) {
            setTheme(localTheme === 'dark' ? 'dark' : 'light')
        } else {
            setTheme( 'light')
        }
    }, [])

    useEffect(() => {
        // document.documentElement.classList.toggle('dark', theme == 'dark')
        if (!theme) {
            return;
        }

        localStorage.setItem('theme', theme === 'dark' ? 'dark' : 'light')
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme])

    listen()

    return [theme, setTheme] as const
}