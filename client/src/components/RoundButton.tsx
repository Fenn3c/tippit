import React from 'react'

type Props = {
    text: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    className?: string
}

export default function RoundButton({ text, onClick, className }: Props) {
    return (
        <button className={`rounded-full px-4 py-1 border border-gray-text bg-main-white active:bg-gray-stroke ${className ? className : ''}`}
            onClick={onClick}>
            <span className='font-medium text-main-500 whitespace-nowrap'>{text}</span>
        </button>
    )
}