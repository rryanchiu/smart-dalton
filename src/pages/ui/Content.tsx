import type {ReactElement} from 'react'

interface Props {
    className?: string
    children: ReactElement
}

export const Content = (props: Props) => {
    return (
        <div className={['w-full h-full relative flex flex-col',
            props.className || '',
        ].join(' ')}
        >
            {props.children}
        </div>
    )
}
