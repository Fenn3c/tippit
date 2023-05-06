import { AnimatePresence, Variants, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const animation: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
}

export default function Transition({ children }: Props) {
    const { asPath } = useRouter();
    return (
        <AnimatePresence
            initial={false}>
            <motion.div variants={animation}
                key={asPath}
                initial="initial"
                animate="animate"
                exit="initial"
                transition={{ duration: .1 }}>
                {children}
            </motion.div>
        </AnimatePresence>

    )
}