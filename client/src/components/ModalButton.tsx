import React from 'react'

type Props = {
    text: string
    red?: boolean
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function ModalButton({ text, onClick, red = false }: Props) {
    return (
        <button onClick={onClick} className={`font-bold text-xl ${red && 'text-error'}`}>{text}</button>
    )
}