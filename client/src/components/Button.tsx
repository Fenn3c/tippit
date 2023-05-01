import React from 'react'

type Props = {
    text: string
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    disabled?: boolean
    type?: 'button' | 'submit'
}

export default function Button({ text, onClick, disabled = false, type = 'button' }: Props) {
    return (
        <button type={type} className='bg-main-500 active:bg-main-600 px-8 py-4 text-main-white font-semibold rounded-2xl w-full shadow-lg
        disabled:bg-gray-text cursor-not-allowed'
            onClick={onClick} disabled={disabled}>
            {text}
        </button>
    )
}