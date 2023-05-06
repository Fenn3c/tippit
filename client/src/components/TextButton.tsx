import React from 'react'

type Props = {
    text: string,
    onClick?: React.MouseEventHandler<HTMLSpanElement>
}

export default function TextButton({ text, onClick }: Props) {
    return (
        <span onClick={onClick} className="text-main-500 active:text-main-600 cursor-pointer">{text}</span>
    )
}