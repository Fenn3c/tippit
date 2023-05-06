import React from 'react'
import Image from 'next/image'
import AddButtonIcon from './AddButtonIcon'
import MenuButtonIcon from './MenuButtonIcon'

type Props = {
  onAddClick?: React.MouseEventHandler<HTMLButtonElement>
  onMenuClick?: React.MouseEventHandler<HTMLButtonElement>
  clean?: boolean
}

export default function Header({ onAddClick, onMenuClick, clean = false }: Props) {
  return (
    <header className={`p-4 h-16 bg-white shadow-lg flex items-center ${clean ? 'justify-center' : 'justify-between'}`}>
      <Image src="/logotype.svg" alt="Tippit" width={60} height={20} />
      <div className="flex gap-x-2">
        {onAddClick && !clean && <button onClick={onAddClick}>
          <AddButtonIcon />
        </button>}
        {onMenuClick && !clean && <button onClick={onMenuClick}>
          <MenuButtonIcon />
        </button>}
      </div>
    </header>
  )
}