import React from 'react'

type Props = {
    text: string
    icon?: React.ReactNode
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
    type?: 'button' | 'submit'
}

export default function Button({ type, onClick, disabled, text, icon }: Props) {
    return (

        <button type={type} className={`bg-main-500
        active:bg-main-600 px-8 py-4 text-main-white font-semibold rounded-2xl w-full shadow-lg
        disabled:bg-gray-text  flex items-center justify-center gap-x-2 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={onClick} disabled={disabled}>
            {text}
            {icon && icon}
        </button>
    )
}