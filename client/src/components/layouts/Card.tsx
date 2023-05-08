import React from 'react'

type Props = {
  children: React.ReactNode
  bigYpadding?: boolean
  bigXpadding?: boolean
  className?: string
  square?: boolean
}

export default function Card({ children, bigYpadding = false, bigXpadding = false, square = false, className = '' }: Props) {
  let styles = `bg-main-white rounded-3xl border border-gray-stroke shadow-lg px-4 ${bigYpadding ? 'py-8' : 'py-4'}  ${bigXpadding ? 'px-8' : 'px-4'} ${className}`
  if (square) styles += `w-full pb-[calc(100%-1rem)] h-0`
  return (
    <div className={styles}>
      {children}
    </div>
  )
}