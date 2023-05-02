import React from 'react'

type Props = {
    text?: string
    onChange?: React.ChangeEventHandler<HTMLInputElement>
    checked?: boolean
}

export default function Switch({ text, checked = false, onChange }: Props) {
    return (
        <div className="flex gap-x-3 items-center">
            <label className="relative inline-block rounded-full w-12 h-[28px]
        border
        box-content
        border-gray-stroke
        transition-all
        ">
                <input className="opacity-0 w-0 h-0 peer" type="checkbox" onChange={onChange} checked={checked} />
                <span className="absolute
            transition-all
            cursor-pointer 
            top-0 
            left-0
            right-0
            bottom-0
            bg-main-white
            peer-checked:bg-main-500
            rounded-full
            before:transition-all
            before:content-['']
            before:absolute
            before:w-5
            before:h-5
            before:rounded-full
            before:left-1
            before:top-1
            before:bg-gray-text
            peer-checked:before:bg-main-white
            peer-checked:before:translate-x-5
  
            "></span>
            </label>
            <span className='text-gray-text font-medium'>{text}</span>
        </div>

    )
}