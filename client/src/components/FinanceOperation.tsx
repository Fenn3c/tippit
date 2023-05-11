import React from 'react'
import Card from './layouts/Card'
import { formatMoney } from '@/utils/formatMoney'

type Props = {
    name: string
    comment?: string,
    amount: number
}

export default function FinanceOperation({ name, comment, amount }: Props) {
    return (
        <Card className="flex items-center justify-between">
            <div className='h-10 flex flex-col justify-center'>
                <p>{name}</p>
                {comment && <p className="text-gray-text font-normal">{comment}</p>}
            </div>
            <p className={amount > 0 ? 'text-done' : 'text-main-black'}>
                {amount > 0 ? `+ ${formatMoney(amount)}` : `${formatMoney(amount)}`}
            </p>
        </Card >
    )
}