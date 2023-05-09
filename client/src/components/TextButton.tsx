import React from 'react'

type Props = {
    text: string,
    onClick?: React.MouseEventHandler<HTMLSpanElement>
    className?: string
}

export default function TextButton({ text, onClick, className }: Props) {
    return (
        <span onClick={onClick} className={`text-main-500 active:text-main-600 cursor-pointer ${className ? className : ''}"`}>{text}</span>
    )
}