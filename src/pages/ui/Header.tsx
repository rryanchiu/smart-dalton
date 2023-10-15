import type {ReactElement} from 'react'

interface Props {
    title?: string
    direction: 'left' | 'right'
    className?: string
    extend: ReactElement
}


export const Header = (props: Props) => {

    return (
        <header className={['header',
            props.className || '',
        ].join(' ')}>
            <b>{props.title || ''}</b>
            {props.extend}
        </header>

    )
}

