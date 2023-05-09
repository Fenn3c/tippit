import React, { useState } from 'react'
import DropDownIcon from './DropDownIcon'
import Card from './layouts/Card'
import { motion } from 'framer-motion'

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
        setOpen(false)
        options[id].onSelect?.()
    }
    return <>
        <button onClick={handleOpen} className='text-main-500 font-bold flex items-center mb-2'>{options[selected]?.name}<DropDownIcon open={open} /></button>
        <motion.div
            initial={{
                height: 0,
                opacity: 0
            }}
            animate={{
                height: open ? 'auto' : 0,
                opacity: open ? 1 : 0
            }}>
            <Card className='flex flex-col gap-y-2 items-start'>
                {Object.entries(options).map(([id, option], index) =>
                    <button key={index} className={`font-bold ${selected === id ? 'text-main-500' : ''}`} onClick={() => handleClick(id)}>{option.name}</button>
                )}
            </Card>
        </motion.div>


    </>


}