import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Props = {
    value: number,
    maxValue?: number,
    animationDuration?: number,
    animationDelay?: number,
    className?: string
}

export default function Progress({ value, maxValue = 100, animationDuration, animationDelay, className = '' }: Props) {

    return (
        <div className='flex items-center gap-x-1'>
            <div className="text-main-500 font-bold">{value}/{maxValue}</div>
        <div className={`w-24 h-2 rounded bg-main-50 relative overflow-hidden ${className}`}>
            <AnimatePresence>
                <motion.div
                    className='bg-main-500 rounded w-full h-full absolute'
                    initial={
                        { right: '100%' }
                    }
                    animate={{
                        right: value && maxValue ? `${100 - Math.round((value / maxValue) * 100)}%` : '100%',
                        transition: {
                            duration: animationDuration,
                            delay: animationDelay,
                            ease: 'backOut'
                        }
                    }
                    }
                >

                </motion.div>
            </AnimatePresence>
        </div>
        </div>

    )
}