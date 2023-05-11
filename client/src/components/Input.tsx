import React from 'react'
import InputMask from 'react-input-mask'
import RoundButton from './RoundButton'

export type InputProps = {
    value?: string,
    label?: string,
    bottomLabel?: string,
    placeholder?: string
    required?: boolean,
    type?: 'text' | 'password' | 'tel' | 'number'
    numberic?: boolean
    mask?: string
    error?: string
    touched?: boolean
    innerButtonText?: string
    onInnerButtonClick?: React.MouseEventHandler<HTMLButtonElement>
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    onFocus?: React.FocusEventHandler<HTMLInputElement>
}

export default function Input({ value = '', label = '', bottomLabel = '', placeholder = '',
    required = false, type = "text", error, touched = false, mask, numberic = false, onChange, onFocus, innerButtonText, onInnerButtonClick }: InputProps) {


    const inputStyles = `bg-gray-bg border border-gray-stroke rounded-xl py-3 px-4 font-medium
         outline-none placeholder:text-gray-text w-full
          ${error && touched ? '!border-error' : 'focus:border-main-500'}`
    return (
        <label className='flex flex-col w-full'>
            <span className='font-medium mb-2'>
                {label}{required && <span className='!text-error'>*</span>}
            </span>
            <div className="w-full relative">
                {mask ?
                    <InputMask mask={mask} className={inputStyles}
                        type={type}
                        placeholder={placeholder}
                        onChange={onChange}
                        onFocus={onFocus}
                        inputMode={numberic ? 'numeric' : undefined}
                    /> :
                    <input className={inputStyles}
                        type={type}
                        placeholder={placeholder}
                        onChange={onChange}
                        onFocus={onFocus} value={value}
                        inputMode={numberic ? 'numeric' : undefined}
                    />

                }
                {innerButtonText && <RoundButton text={innerButtonText} className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={onInnerButtonClick} />}
            </div>

            {error && touched ? <span className='font-medium text-xs text-error mt-1'>{error}</span>
                :
                bottomLabel && <span className='font-medium text-xs text-gray-text mt-1'>{bottomLabel}</span>}

        </label>
    )
}