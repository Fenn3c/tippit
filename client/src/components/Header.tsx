import React from 'react'
import Image from 'next/image'
import AddButtonIcon from './AddButtonIcon'
import MenuButtonIcon from './MenuButtonIcon'

type Props = {
  onAddClick?: React.MouseEventHandler<HTMLButtonElement>
  onMenuClick?: React.MouseEventHandler<HTMLButtonElement>
}

export default function Header({ onAddClick, onMenuClick }: Props) {
  return (
    <header className='p-4 h-16 bg-white shadow-lg flex justify-between items-center'>
      <Image src="/logotype.svg" alt="Tippit" width={60} height={20} />
      <div className="flex gap-x-2">
        {onAddClick && <button onClick={onAddClick}>
          <AddButtonIcon />
        </button>}
        {onMenuClick && <button onClick={onMenuClick}>
          <MenuButtonIcon />
        </button>}
      </div>

    </header>
  )
}