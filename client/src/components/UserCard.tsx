import React from 'react'
import Card from './layouts/Card'

type Props = {
    pfp?: string,
    fullname: string,
    position?: string
}

export default function UserCard({ fullname, pfp, position }: Props) {
    return (
        <Card>
            <div className='flex gap-x-4 items-center'>
                <img className='bg-gray-text w-16 h-16 rounded-3xl' src={pfp} alt="" />
                <div>
                    <p className='font-semibold'>{fullname}</p>
                    <p className='text-gray-text'>{position}</p>
                </div>
            </div>
        </Card>
    )
}