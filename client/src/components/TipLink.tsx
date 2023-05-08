import React from 'react'
import Card from './layouts/Card'
import { QRCodeSVG } from 'qrcode.react'
import Button from './Button'
import MoreButtonSvg from './MoreButtonSvg'
import ShareIcon from './ShareIcon'
import { useRouter } from 'next/router'


const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN

type Props = {
    name: string
    uuid: string
    onMoreClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function TipLink({ name, uuid, onMoreClick }: Props) {
    const router = useRouter()
    const handleShare = () => {
        if (!navigator.share) return
        navigator.share({
            title: name,
            url: window.location.href
        }).catch(e => {
            console.error(e)
        })
    }
    return (
        <Card bigYpadding bigXpadding>
            <div className="flex flex-col gap-y-8 items-center text-center relative">
                <button onClick={onMoreClick} className='absolute right-0 top-0'>
                    <MoreButtonSvg />
                </button>
                <div>
                    <p className="font-bold text-xl">{name}</p>
                    <p className="text-gray-text">Ссылка на страницу чаевых</p>
                </div>
                <QRCodeSVG value={`${DOMAIN_NAME}/t/${uuid}`} className='w-48 h-48' />
                <p className='font-semibold'>{DOMAIN_NAME}/t/{uuid}</p>
                <Button text='Поделиться' onClick={handleShare} icon={<ShareIcon />} />
                <p className="text-gray-text">
                    Сканируйте код при помощи камеры или воспользуйтесь ссылкой для оплаты.
                </p>
            </div>

        </Card>
    )
}