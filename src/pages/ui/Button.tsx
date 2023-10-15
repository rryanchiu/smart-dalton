import type {ReactElement} from 'react'

interface Props {
    icon?: string
    title?: string
    text?: string
    className?: string
    disabled?: boolean
    border?: boolean
    size?: 'sm' | 'md' | 'lg'
    type?: 'normal' | 'bordered' | 'primary' | 'danger' | 'success'
    children?: ReactElement
    onClick?: () => void
}

export const Button = (props: Props) => {
    const content = props.text || props.children
    const buttonSizeClass = () => ({
        sm: 'px-2 h-7.5 text-xs',
        md: 'px-3 h-10 text-md',
        lg: 'px-3 h-10 text-lg',
    }[props.size || 'md'])
    const buttonVariantClass = () => ({
        normal: 'cursor-pointer bg-gray-1 hover:bg-gray-2 active:bg-gray-1 dark:bg-dark-1 dark:hover:bg-dark-2 dark:active:bg-dark-1 hover:bg-gray-1 bg-gray-1 ',
        bordered: 'cursor-pointer b bg-gray-1 hover:bg-gray-2 active:bg-gray-1 dark:bg-dark-1 dark:hover:bg-dark-2 dark:active:bg-dark-1 hover:bg-gray-1 bg-gray-1 ',
        primary: 'cursor-pointer bg-blue-600 hover:bg-blue-500 active:bg-blue-600 text-white',
        success: 'cursor-pointer bg-green-4 hover:bg-green-5 active:hover:bg-green-4  dark:bg-teal-700 hover:dark:bg-teal-600 active:dark:bg-teal-700 text-white  border-transparent hover:(bg-teal-700 dark:bg-teal-800)',
        danger: 'cursor-pointer bg-[#F53F3F] hover:bg-[#F76560] active:bg-[#F53F3F] color-white ',
    }[props.type || 'normal'])
    const iconSizeClass = () => ({
        sm: 'text-base',
        md: 'text-md',
        lg: 'text-lg',
    }[props.size || 'md'])


    return (
        <button
            title={props.title || ''}
            className={[
                ' rd-2 ',
                props.disabled ? '' : buttonVariantClass(),
                buttonSizeClass(),
                props.className,
            ].join(' ')}
            disabled={props.disabled}
            onClick={props.onClick}
        >
            <div className={'flex gap-1.5'}>
                {
                    props.icon &&
                    <div className={`${iconSizeClass()} ${props.icon}`}/>
                }
                {
                    content && <div>{content}</div>
                }
            </div>
        </button>
    )
}
