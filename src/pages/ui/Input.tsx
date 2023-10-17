import {OptionKeyValue} from "../components/bots.tsx";

interface InputProps {
    title?: string;
    type: 'range' | 'text' | 'select';
    tips?: string;
    placeholder?: string;
    showValue?: boolean;
    value?: number | string;
    className?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: OptionKeyValue[];
    onChange?: React.ChangeEventHandler;
}

export const Input = ({
                          title,
                          showValue,
                          type,
                          options,
                          placeholder,
                          tips,
                          value,
                          onChange,
                          className,
                          min,
                          max,
                          step
                      }: InputProps) => {

    if (type === 'select') {
        return (
            <div className={className + 'flex flex-col py-2 pb-[0.2rem]'}>
                <div className={'flex mb2 justify-between'}>
                    <span className={'color-gray-6 dark:color-gray-1'}>{title}</span>
                </div>
                <select className={'select bg-gray-1 p2 rd w-full dark:bg-dark-1'}
                        value={value}
                        onChange={onChange}>
                    {options && options.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>
        )
    }
    return (
        <div className={className + 'flex flex-col py-2 pb-[0.2rem]'}>
            <div className={'flex mb1.2  justify-between'}>
                <span className={'color-gray-6 dark:color-gray-1'}>{title}</span>
                {showValue && <span className={'color-gray-4 font-sm'}>{value}</span>}
            </div>
            <span className={'color-gray-4 dark:color-gray-3 text-[13px]'}>{tips}</span>
            <input
                className={'cursor-pointer bg-gray-1 p1  rd w-full dark:bg-dark-1 ' + (type == 'text' && 'pl3 pr3')}
                type={type}
                title={placeholder}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={onChange}
            ></input>
        </div>
    )

}