import React from 'react'
import TextButton from './TextButton'
import Progress from './Progress'

type Props = {
    currentStep?: number,
    totalSteps?: number,
    handleBack?: React.MouseEventHandler<HTMLSpanElement>
    handleExit?: React.MouseEventHandler<HTMLSpanElement>
    showBack?: boolean
    showExit?: boolean
}

export default function MultiStepControls({ currentStep, totalSteps, handleBack, handleExit, showBack = false, showExit = false }: Props) {
    return (
        <div className='flex justify-between items-center mb-8'>
            {showBack && <TextButton text='Назад' onClick={handleBack} />}
            {currentStep &&
                <div className="mx-auto">
                    <Progress value={currentStep} maxValue={totalSteps} />
                </div>}
            {showExit && <TextButton text='Выйти' onClick={handleExit} />}
        </div>
    )
}