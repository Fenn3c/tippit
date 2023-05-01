import React from 'react'
import InputMask from 'react-input-mask'

type Props = {
    value: string,
    label?: string,
    bottomLabel?: string,
    placeholder?: string
    required?: boolean,
    type?: 'text' | 'password' | 'tel'
    mask?: string
    error?: string
    touched?: boolean
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    onFocus?: React.FocusEventHandler<HTMLInputElement>
}

export default function Input({ value = '', label = '', bottomLabel = '', placeholder = '',
    required = false, type = "text", error = "", touched = false, mask, onChange, onFocus }: Props) {


    const inputStyles = `bg-gray-bg border border-gray-stroke rounded-xl py-3 px-4 font-medium
         outline-none placeholder:text-gray-text ${error && touched ? 'border-error' : 'focus:border-main-500'}`
    return (
        <label className='flex flex-col w-full'>
            <span className='font-medium mb-2'>
                {label}{required && <span className='text-error'>*</span>}
            </span>
            {mask ?
                <InputMask mask={mask} className={inputStyles}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    onFocus={onFocus}
                /> :
                <input className={inputStyles}
                    type={type}
                    placeholder={placeholder}
                    onChange={onChange}
                    onFocus={onFocus} value={value}/>
            }
            {error && touched ? <span className='font-medium text-xs text-error mt-1'>{error}</span>
                :
                bottomLabel && <span className='font-medium text-xs text-gray-text mt-1'>{bottomLabel}</span>}

        </label>
    )
}