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
    topLabel: string
    link: string
    bottomLabel: string
    onMoreClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function QrCard({ name, topLabel, link, bottomLabel, onMoreClick }: Props) {
    const router = useRouter()
    const handleShare = () => {
        if (!navigator.share) return
        navigator.share({
            title: name,
            url: link
        }).catch(e => {
            console.error(e)
        })
    }
    return (
        <Card bigYpadding bigXpadding>
            <div className="flex flex-col gap-y-8 items-center text-center relative">
                {onMoreClick &&
                    <button onClick={onMoreClick} className='absolute right-0 top-0'>
                        <MoreButtonSvg />
                    </button>}

                <div>
                    <p className="font-bold text-xl">{name}</p>
                    <p className="text-gray-text">{topLabel}</p>
                </div>
                <QRCodeSVG value={link} className='w-48 h-48' />
                <p className='font-semibold max-w-full break-words'>{link}</p>
                <Button text='Поделиться' onClick={handleShare} icon={<ShareIcon />} />
                <p className="text-gray-text">
                    {bottomLabel}
                </p>
            </div>

        </Card>
    )
}