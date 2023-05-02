import React from 'react'

type Props = {
    text: string,
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function RoundButton({ text, onClick }: Props) {
    return (
        <button className='rounded-full px-4 py-1 border border-gray-text active:bg-gray-stroke'
            onClick={onClick}>
            <span className='font-medium text-main-500 whitespace-nowrap'>{text}</span>
        </button>
    )
}