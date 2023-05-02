import React from 'react'
import Header from '../Header'
import Head from 'next/head'

type Props = {
    children: React.ReactNode
    title?: string
}

export default function Layout({ children, title = '' }: Props) {
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
            </Head>
            <Header />
            <main className="bg-gray-bg px-4 py-8 relative">
                {title && <h1 className='text-2xl font-bold mb-8'>{title}</h1>}
                {children}
            </main>
        </>
    )
}