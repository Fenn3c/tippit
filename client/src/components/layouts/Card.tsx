import React from 'react'

type Props = {
  children: React.ReactNode
  bigYpadding?: boolean
  className?: string
}

export default function Card({ children, bigYpadding = false, className = ''}: Props) {
  return (
    <div className={`bg-main-white rounded-3xl border border-gray-stroke shadow-lg px-4 ${bigYpadding ? 'py-8' : 'py-4'} ${className}`}>
      {children}
    </div>
  )
}