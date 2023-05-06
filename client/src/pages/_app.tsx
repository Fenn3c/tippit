import Transition from '@/components/layouts/Transition'
import '@/styles/globals.css'
import { AnimatePresence } from 'framer-motion'
import type { AppProps } from 'next/app'


export default function App({ Component, pageProps }: AppProps) {
  return <Transition>
    <Component {...pageProps} />
  </Transition>

}
