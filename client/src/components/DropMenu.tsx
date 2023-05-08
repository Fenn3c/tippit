import React, { useState } from 'react'

type Props = {
    options: { [key: string | number]: { name: string, onSelect?: () => void } },
    initialId?: string | number,
}

export default function DropMenu({ options, initialId = 0 }: Props) {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<string | number>(initialId)
    const handleOpen = () => {
        setOpen(!open)
    }
    const handleClick = (id: string | number) => {
        setSelected(id)
        options[id].onSelect?.()
    }
    return <>
        <button onClick={handleOpen}>{options[selected]?.name}</button>
        {open && <div className='flex flex-col'>
            {Object.entries(options).map(([id, option], index) =>
                <button onClick={() => handleClick(id)}>{option.name}</button>
            )}
        </div>}

    </>


}