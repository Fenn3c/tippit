import React from 'react'
import Card from './layouts/Card'
import Image from 'next/image'

type Props = {
    pfp?: string | null,
    fullname: string,
    position?: string
}

export default function UserCard({ fullname, pfp, position }: Props) {
    return (
        <Card>
            <div className='flex gap-x-4 items-center'>
                {pfp ?
                    <img className='bg-gray-text w-16 h-16 rounded-3xl' src={`${process.env.NEXT_PUBLIC_STATIC_HOST}/${pfp}`} alt="" /> :
                    <Image width={128} height={128} className='bg-gray-text w-16 h-16 rounded-3xl' src='/default-pfp.png' alt='default-pfp' />

                }
                <div>
                    <p className='font-semibold'>{fullname}</p>
                    <p className='text-gray-text'>{position}</p>
                </div>
            </div>
        </Card>
    )
}