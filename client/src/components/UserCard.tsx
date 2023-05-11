import React from 'react'
import Card from './layouts/Card'
import Image from 'next/image'

type Props = {
    pfp?: string | null,
    fullname: string,
    position?: string
    className?: string
}

export default function UserCard({ fullname, pfp, position, className }: Props) {
    return (
        <Card className={className}>
            <div className='flex gap-x-4 items-center'>
                {pfp ?
                    <img className='bg-gray-text w-16 h-16 rounded-3xl' src={`${process.env.NEXT_PUBLIC_STATIC_HOST}/${pfp}`} alt="" /> :
                    <Image width={128} height={128} className='bg-gray-text w-16 h-16 rounded-3xl' src='/default-pfp.png' alt='default-pfp' />

                }
                <div className='flex flex-col items-start'>
                    <p className='font-semibold'>{fullname}</p>
                    <p className='text-gray-text'>{position}</p>
                </div>
            </div>
        </Card>
    )
}