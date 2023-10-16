import {defineConfig, presetAttributify, presetIcons, presetTypography, presetUno} from 'unocss'

export default defineConfig({
    theme: {
        colors: {},

    },
    presets: [
        presetIcons({scale: 1.2, warn: true}),
        presetAttributify(),
        presetUno({
            dark: "class"
        }),
        presetTypography({}),
    ],
    shortcuts: [{
        'container': 'bg-gray-1 dark:bg-dark-2 dark:color-gray-2  w-full h-full',
        'fullscreen':' px-20 py-10 ',
        'layout': ' w-full h-full  flex relative  bg-white  dark:bg-dark-4   overflow-hidden  ',
        'fullscreenlayhout': 'rd-5  ',
        'header': 'min-h-[65px] flex  justify-between items-center border-b p3 dark:border-dark-1',
        'sidebar': 'transition-transform ease-out bg-white dark:bg-dark relative shrink-0 w-[260px]  dark:border-dark-1 dark:color-gray-1 h-full hidden md:block',
        'footer': 'absolute bottom-0 color-gray text-sm m-3 float-right',
        'mask': 'absolute w-full h-full bg-gray-1 z-1 ',
        'bg-modal': 'bg-white dark:bg-[#181818]',
        'fg-base': 'text-dark dark:text-[#dadada]',
        'border-base': 'border-light-700 dark:border-dark-1',
        'list': 'w-full h-full  overflow-x-hidden overflow-y-auto p2',
        'listitem': '  lh-7.5 my1  hover:bg-gray-1 dark:hover:bg-dark-2 active:bg-gray-1 dark:active:bg-dark-3 cursor-pointer rd-2 py2 px3 text-sm ',
        'selected': 'bg-gray-1 dark:bg-dark-2',
        'cardlist': 'fcc',
        'card': 'flex flex-col  w-full max-w-md mx-12 sm:mx-18 overflow-hidden m-auto p5 bg-gray-1 dark:bg-dark-1 b-dark-4 rd-2',
        'chatbox': 'flex flex-col  w-full overflow-x-hidden overflow-y-scroll dark:bg-dark-1 b-dark-4 p-2',
        'chatitem': 'm-1  p-5 rd-2 color-dark-1  text-sm font-500 w-full ',
        'chattext': ' w-full color-dark-2 dark:color-gray-2 resize-vertical b-none  dark:bg-dark-1 bg-gray-1  pl5 pr25 pt3 pb3 rd-2 h-full',

        'btn': 'ml2 dark:bg-dark-2 dark:hover:bg-dark  rd-2 p1  hover:bg-gray-1 bg-gray-1 pl3 pr3 pt2 pb2 hover:bg-gray-2 ',
    }],
    preflights: [{
        layer: 'base',
        getCSS: () => `
      :root {
      }

      html,body {
        height: 100%;
      }

      html.dark {
        --c-scroll: #333333;
        --c-scroll-hover: #555555;
        --c-shadow: #ffffff08;
      }
    `,
    }],
})