import React, { useEffect, useState } from 'react'
import Input, { InputProps } from './Input'
import { formatMoney, CURRENCY_SUFFICS } from '@/utils/formatMoney'



type MoneyInputProps = Omit<InputProps, 'mask' | 'type' | 'numberic' | 'value' | 'onChange'> & {
    onChange?: (value: number) => void,
    initialValue: number
}

const clearAmountValue = (val: string): number => Number(val.replace(/\D/g, ''))

export default function MoneyInput({ onChange, initialValue, ...InputProps }: MoneyInputProps) {
    useEffect(() => {
        setDirtyValue(initialValue ? formatMoney(initialValue) : '')
    }, [initialValue])
    const [dirtyValue, setDirtyValue] = useState(initialValue ? formatMoney(initialValue) : '')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target) return
        let cleanValue = clearAmountValue(e.target.value)
        if (cleanValue > 100000000000) return
        const value = formatMoney(cleanValue * 100);
        setTimeout(() => {
            e.target.selectionEnd = e.target.selectionEnd = e.target.value.length - CURRENCY_SUFFICS.length
        })
        setDirtyValue(value)
        if (onChange) onChange(cleanValue * 100)
    }
    return (
        <Input
            onChange={handleChange}
            type='text'
            value={dirtyValue}
            numberic
            {...InputProps}
        />
    )
}