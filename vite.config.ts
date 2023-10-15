import {defineConfig} from 'vite'
import React from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'

export default defineConfig({
    plugins: [React(), UnoCSS(),],
})
