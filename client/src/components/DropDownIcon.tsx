import { motion } from 'framer-motion'
import React from 'react'

type Props = {
    open?: boolean
}

export default function DropDownIcon({ open = false }: Props) {
    return (
        <motion.div
            animate={{
                rotate: open ? '180deg' : 0
            }}>
            <svg className="fill-main-500" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.9999 15.657L16.2429 11.414L14.8279 10L11.9999 12.829L9.17192 10L7.75692 11.414L11.9999 15.657Z" />
            </svg>
        </motion.div>


    )
}