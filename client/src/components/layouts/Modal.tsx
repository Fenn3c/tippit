import React from 'react'
import CloseIcon from '../CloseIcon'
import { motion } from 'framer-motion'

type Props = {
    children: React.ReactNode
    open?: boolean
    onClose?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Modal({ children, onClose, open = false }: Props) {

    return (
        <motion.div
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: open ? 1 : 0,
                pointerEvents: open ? 'auto' : 'none'
            }}
            transition={{ duration: 0.1 }}
            className='fixed z-40 left-0 right-0 bottom-0 top-0 bg-main-black bg-opacity-20'>

            <motion.div
                animate={{
                    translateY: open ? 0 : '100vh'
                }}
                transition={{ duration: 0.4, ease: 'backOut' }}

                className='absolute left-0 right-0 bottom-0 top-1/4 p-8
             bg-main-white rounded-t-3xl border border-gray-stroke shadow-lg
             after:content-[""]
             after:absolute
             after:block
             after:w-full
             after:bg-main-white
             after:h-32
             after:-bottom-32
             after:left-0
             
                          '>
                <button onClick={onClose} className='block ml-auto'>
                    <CloseIcon />
                </button>
                <div className='flex flex-col gap-y-8 items-center'>
                    {children}
                </div>

            </motion.div>

        </motion.div>



    )

}