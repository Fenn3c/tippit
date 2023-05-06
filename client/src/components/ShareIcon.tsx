import React from 'react'

type Props = {}

export default function ShareIcon({ }: Props) {
    return (
        <svg className='fill-main-white' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 23C5.45 23 4.979 22.804 4.587 22.412C4.195 22.02 3.99934 21.5493 4 21V10C4 9.45 4.196 8.979 4.588 8.587C4.98 8.195 5.45067 7.99933 6 8H9V10H6V21H18V10H15V8H18C18.55 8 19.021 8.196 19.413 8.588C19.805 8.98 20.0007 9.45067 20 10V21C20 21.55 19.804 22.021 19.412 22.413C19.02 22.805 18.5493 23.0007 18 23H6ZM11 16V4.825L9.4 6.425L8 5L12 1L16 5L14.6 6.425L13 4.825V16H11Z" />
        </svg>
    )
}