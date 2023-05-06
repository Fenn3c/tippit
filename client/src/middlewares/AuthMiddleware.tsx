import React, { useEffect } from 'react'

type Props = {
    children: React.ReactNode
}

export default function AuthMiddleware({ children }: Props) {
    useEffect(() => {
        console.log(localStorage)
    }, [])
    return (
        { children }
    )
}