import React, { useState } from 'react'
import Header from '../Header'
import Head from 'next/head'
import Modal from './Modal'
import ModalButton from '../ModalButton'
import Link from 'next/link'

type Props = {
    children: React.ReactNode
    title?: string
    onAddClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Layout({ children, title = '', onAddClick }: Props) {
    const [modal, setModal] = useState<boolean>(false)
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
            </Head>
            <Header onMenuClick={() => setModal(!modal)} onAddClick={onAddClick} />
            <main className="bg-gray-bg px-4 py-8 relative">
                {title && <h1 className='text-2xl font-bold mb-8'>{title}</h1>}
                {children}
            </main>
            <Modal open={modal} onClose={() => setModal(false)}>
                <Link href="/">
                    <ModalButton text='QR и ссылки' />
                </Link>
                <Link href="/statistics">
                    <ModalButton text='Статистика' />
                </Link>
                <Link href="/finance">
                    <ModalButton text='Баланс и история' />
                </Link>
                <Link href="/profile">
                    <ModalButton text='Профиль' />
                </Link>
                <Link href="/org">
                    <ModalButton text='Организация' />
                </Link>
            </Modal>
        </>
    )
}