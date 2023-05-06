import React, { useState } from 'react'

type Props = {
    label?: string,
    bottomLabel?: string,
    required?: boolean,
    error?: string,
    touched?: boolean,
    squareImg?: boolean,
    onChange: (file: File) => void
    initialFile?: File | null
    initialLink?: string | null
}

export default function ImageUpload({ label = '', bottomLabel = '', required = false, error, touched = false, squareImg = false, onChange, initialFile = null, initialLink }: Props) {
    const [selectedFile, setSelectedFile] = useState<File | null>(initialFile)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            console.log('file')
            onChange(file);
        }
    }
    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
    return (
        <div className="w-full">
            {(selectedFile || initialLink) && !error &&
                <img className={`h-16 w-auto rounded-xl mx-auto mb-3 ${squareImg && 'w-16 object-cover'}`}
                    src={
                        selectedFile ?
                            URL.createObjectURL(selectedFile) :
                            `${process.env.NEXT_PUBLIC_STATIC_HOST}/${initialLink}`
                    } alt="" />
            }
            <label className='flex flex-col w-full'>
                <span className='font-medium mb-2'>
                    {label}{required && <span className='text-error'>*</span>}
                </span>
                <button
                    onClick={handleClick}
                    className={`bg-gray-bg border border-gray-stroke rounded-xl py-3 px-4 font-medium text-main-500
         outline-none placeholder:text-gray-text ${error && touched ? '!border-error !text-error' : 'focus:border-main-500'}`}>
                    {selectedFile ? 'Выбрать другое изображение' : 'Выбрать изображение'}
                </button>
                <input type='file' className='hidden' ref={inputRef} onChange={handleFileChange} />

                {error && touched ? <span className='font-medium text-xs text-error mt-1'>{error}</span>
                    :
                    bottomLabel && <span className='font-medium text-xs text-gray-text mt-1'>{bottomLabel}</span>}

            </label>
        </div>

    )
}