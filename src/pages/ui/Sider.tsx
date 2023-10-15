import type {ReactElement} from 'react'

interface Props {
    id?: string
    direction: 'left' | 'right'
    className?: string
    children: ReactElement
}


export const Sider = (props: Props) => {
    const containerBaseClass = {
        left: 'w-[280px] h-full border-r',
        right: 'w-[280px] h-full border-l',
    }[props.direction]

    return (
        <aside
            id={props.id || ''}
            className={[
                'sidebar z-2',
                containerBaseClass,
                props.className || '',
            ].join(' ')}
        >
            {props.children}
        </aside>
    )
}

