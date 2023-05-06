import React from 'react'

type Props = {
  children: React.ReactNode
  bigYpadding?: boolean
  bigXpadding?: boolean
  className?: string
}

export default function Card({ children, bigYpadding = false, bigXpadding = false, className = '' }: Props) {
  return (
    <div className={`bg-main-white rounded-3xl border border-gray-stroke shadow-lg px-4 ${bigYpadding ? 'py-8' : 'py-4'}  ${bigXpadding ? 'px-8' : 'px-4'} ${className}`}>
      {children}
    </div>
  )
}