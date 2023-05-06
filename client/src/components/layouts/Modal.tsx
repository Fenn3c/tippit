import React from 'react'
import CloseIcon from '../CloseIcon'

type Props = {
    children: React.ReactNode
    open?: boolean
    onClose?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Modal({ children, onClose, open = false }: Props) {
    if (open)
        return (
            <div className='fixed left-0 right-0 bottom-0 top-0 bg-main-black bg-opacity-20'>
                <div className='absolute left-0 right-0 bottom-0 top-1/4 p-8
             bg-main-white rounded-t-3xl border border-gray-stroke shadow-lg'>
                    <button onClick={onClose} className='block ml-auto'>
                        <CloseIcon />
                    </button>
                    <div className='flex flex-col gap-y-8 items-center'>
                        {children}
                    </div>

                </div>

            </div>

        )
    return null
}