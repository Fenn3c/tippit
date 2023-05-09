import { AnimatePresence, Variants, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import LoadingIcon from '../LoadingIcon'
import Image from 'next/image'

const LOADER_THRESHOLD = 250

type Props = {
    children: React.ReactNode
}

const animation: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
}

export default function Transition({ children }: Props) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    React.useEffect(() => {
        let timer: any;
        const start = () => timer = setTimeout(() => setLoading(true), LOADER_THRESHOLD);
        const end = () => {
            if (timer) {
                clearTimeout(timer);
            }
            setLoading(false);
        }
        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', end);
        router.events.on('routeChangeError', end);
        return () => {
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', end);
            router.events.off('routeChangeError', end);

            if (timer) {
                clearTimeout(timer.current);
            }
        }
    }, [router.events])

    return (<>


        {/* <motion.div variants={animation}
                key={router.asPath}
                initial="initial"
                animate="animate"
                exit="initial"
                transition={{ duration: .1 }}>
                {children}
            </motion.div> */}

        {loading && <div className="fixed top-0 left-0 right-0 bottom-0 z-50 bg-main-white flex justify-center items-center">
            <Image className='animate-bounce' src="/logotype.svg" alt="Tippit" width={60} height={20} />
        </div>}
        <div key={router.asPath}>
            {children}
        </div>
    </>

    )
}