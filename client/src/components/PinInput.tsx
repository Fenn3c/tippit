import React, { useRef, useState } from 'react';

interface PinInputProps {
    title?: string
    length: number
    type?: 'number' | 'password'
    onComplete: (pin: string) => void
    error?: string
    touched?: boolean
}

const PinInput: React.FC<PinInputProps> = ({ length, onComplete, title = '', type = 'number', error, touched = false}) => {
    const [pin, setPin] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = event.target;
        if (!value.match(/^[0-9]*$/)) return
        const newPin = [...pin];
        newPin[index] = value.slice(-1);
        setPin(newPin);

        // Automatically focus the next input
        if (newPin[index] !== '' && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }

        if (newPin.every((digit) => digit !== '')) {
            onComplete(newPin.join(''));
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pasteData = event.clipboardData.getData('text/plain');
        const newPin = [...pin];
        for (let i = 0; i < length; i++) {
            newPin[i] = pasteData.charAt(i) || '';
        }
        if (newPin.every((digit) => digit !== '' && digit.match(/^[0-9]*$/))) {
            setPin(newPin);
            onComplete(newPin.join(''));
        } else {
            return
        }
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.select();
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === 'Backspace' && !pin[index] && inputRefs.current[index - 1]) {
            event.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }
    };


    const inputStyle = `bg-gray-bg text-center border border-gray-stroke outline-none w-9 h-11 rounded-xl font-medium focus:border-main-500 ${(error && touched) && '!border-error'}`
    return (
        <div className='flex flex-col items-center gap-y-2'>
            <p className='text-center font-medium'>{title}</p>
            <div className="flex gap-x-2">
                {pin.map((digit, index) => (
                    <input
                        className={inputStyle}
                        key={index}
                        type={type}
                        maxLength={1}
                        value={digit}
                        onChange={(event) => handleChange(event, index)}
                        onFocus={handleFocus}
                        onPaste={handlePaste}
                        ref={(ref) => inputRefs.current[index] = ref}
                        onKeyDown={(event) => handleKeyDown(event, index)}
                        autoFocus={index === 0}
                    />
                ))}
            </div>
            {(error && touched) && <span className='font-medium text-xs text-error mt-1'>{error}</span>}
        </div>

    );
};

export default PinInput;
