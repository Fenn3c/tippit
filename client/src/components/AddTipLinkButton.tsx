import React from 'react'
import AddButtonIcon from './AddButtonIcon'

type Props = {
    onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function AddTipLinkButton({ onClick }: Props) {
    return (
        <button onClick={onClick} className='w-full flex justify-center items-center rounded-3xl border border-main-black px-4 py-8'>
            <AddButtonIcon black />
        </button>
    )
}