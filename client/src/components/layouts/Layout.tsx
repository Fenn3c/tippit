import React from 'react'
import Header from '../Header'

type Props = {
    children: React.ReactNode
    title?: string
}

export default function Layout({ children, title = '' }: Props) {
    return (
        <>
            <Header />
            <main className="bg-gray-bg px-4 py-8">
                <h1 className='text-2xl font-bold mb-8'>{title}</h1>
                {children}
            </main>
        </>
    )
}