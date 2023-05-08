import React from 'react'

type Props = {
    percent: number
}

export default function PercentChange({percent}: Props) {
    const percentPositive = percent >= 0
    return (
        <div className='flex items-center gap-0.5'>
            <p className={`${percentPositive ? 'text-green-600' : 'text-red-600'}  text-xs font-bold`}>{percent}%</p>

            {percentPositive ?
                <svg className='fill-green-600' width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.7 9 1 8.3l3.7-3.725 2 2L9.3 4H8V3h3v3h-1V4.7L6.7 8l-2-2-3 3Z" />
                </svg>
                :
                <svg className='fill-red-600' width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="m1.7 3-.7.7 3.7 3.725 2-2L9.3 8H8v1h3V6h-1v1.3L6.7 4l-2 2-3-3Z" />
                </svg>}
        </div>
    )
}