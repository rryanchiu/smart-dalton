import {useState} from "react";
import {useI18n} from "../../hooks";
import {ActorProp} from "../../types/ActorProp.ts";


interface CardSelectProp {
    value: string
    className?: string
    size?: 'sm' | 'md' | 'lg'
    options?: ActorProp[];
    onChange?: React.ChangeEventHandler;
}

export const CardSelect = ({
                               value,
                               size,
                               className,
                               onChange,
                               options
                           }: CardSelectProp) => {
    const sizeClasses = () => ({
        sm: ' h-7.5 text-xs',
        md: ' h-10 text-md',
        lg: ' h-10 text-lg',
    }[size || 'md'])
    const {t} = useI18n()

    const [selecting, setSelecting] = useState(true);

    const selectingClasses = () => {
        if (selecting) {
            return ' overflow-y-hidden';
        } else {
            return ' h-80  overflow-y-auto';
        }
    }

    function selectedClass(id: string) {
        if (selecting) {
            return 'hidden'
        }
        if (!value || value != id) {
            return "z-3 hover:b-dark-1 bg-white my2 py2 px3 rd-3 hover:shadow-2xl b dark:bg-dark-3 dark:b-none dark:hover:bg-dark-2";
        }
        return "z-3 bg-dark-1 my2 py2 px3 rd-3 hover:shadow-2xl b color-gray-1 dark:b-none dark:bg-dark-400 dark:hover:bg-dark-4";
    }

    const selectItem = (e: any) => {
        e.stopPropagation()
        if (onChange) {
            onChange(e);
        }
    }

    const getCurrentActorTitle = () => {
        if (value === '' || !options) {
            return " " + t('chooseactor');
        }
        // todo Transfer options to map to get item.
        for (const item of options) {
            if (item.id === value) {
                return item.icon + ' ' + item.title;
            }
        }
    }

    return (
        <div onClick={() => setSelecting(!selecting)}
             className={[
                 ' bg-gray-1  dark:bg-dark-1 rd-2 cursor-pointer  overflow-x-hidden px-3 ',
                 sizeClasses(),
                 selectingClasses(),
                 className,
             ].join(' ')}>
            <div className={[sizeClasses(), 'flex justify-between items-center'
            ].join(' ')}>
                <span>{getCurrentActorTitle()}</span>
                <i className={selecting ? 'ri-arrow-' +
                    'down-s-line' : 'ri-arrow-up-s-line'}></i>
            </div>
            {options?.map((item: ActorProp, index) => (
                <div key={index}
                     onClick={selectItem}
                     id={item.id}
                     title={item.icon + ' ' + item.title}
                     className={[' hover:b-blue font-bold  py2 px3 rd-3  py3 hover:shadow-2xl b gap-1.5 ',
                         selectedClass(item.id)
                     ].join(' ')
                     }>
                    <span className={'text-lg'}> {item.icon}</span>
                    <span> {item.title}</span>
                </div>
            ))}
        </div>
    )

}