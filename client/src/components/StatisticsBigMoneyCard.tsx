import React from 'react'
import Card from './layouts/Card'
import { formatMoney } from '@/utils/formatMoney'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'

type Props = {
    title: string,
    money: number
}

export default function StatisticsBigNumberCard({ title, money }: Props) {
    const animatedMoney = useAnimatedCounter(money, 0, 1, 0)
    return (
        <Card square>
            <div className='flex justify-between relative'>
                <p className='font-bold'>{title}</p>
            </div>
            <div className='w-full h-32 flex justify-center items-center p-1/2'>
                <p className={`${money > 9999999 ? 'text-2xl' : 'text-3xl'} font-bold mb-6`}>
                    {formatMoney(animatedMoney)}
                </p>

            </div>

        </Card >
    )
}