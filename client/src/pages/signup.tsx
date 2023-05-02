import Button from "@/components/Button";
import CompleteIcon from "@/components/CompleteIcon";
import Input from "@/components/Input";
import MultiStepControls from "@/components/MultiStepControls";
import PinInput from "@/components/PinInput";
import TextButton from "@/components/TextButton";
import Card from "@/components/layouts/Card";
import Layout from "@/components/layouts/Layout";
import { Formik, useFormik, Field } from "formik";
import { useState } from "react";
import * as Yup from 'yup'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import ImageUpload from "@/components/ImageUpload";

const signupSchema = Yup.object().shape({
    phone: Yup.string().required('Обязательное поле').matches(/^[78]\d{10}$/, 'Неверный формат номера'),
    phoneVerify: Yup.string().required('Неверный PIN'),
    name: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    surname: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    password: Yup.string().required('Обязательное поле').min(8, 'Минимально 8 символов').max(32, 'Максимально 32 символа'),
    passwordConfirm: Yup.string().required('Обязательное поле').oneOf([Yup.ref('password')], 'Пароли не совпадают'),
    position: Yup.string().required('Обязательное поле'),
    pin: Yup.string().required('Обязательное поле').length(5, 'Неверный PIN'),
    pinConfirm: Yup.string().required('Обязательное поле').oneOf([Yup.ref('pin')], 'PIN-коды не совпадают'),
    pfp: Yup.mixed().test(
        'fileFormat',
        'Файл должен быть в формате jpg, jpeg или png',
        (value) => {
            if (!value) return true // Разрешаем пустые значения
            const acceptedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
            console.log(value)
            return value instanceof File && acceptedFormats.includes(value.type);
        }
    )
})
export default function SignUp() {
    const [step, setStep] = useState(1)

    const initialValues = {
        phone: '',
        phoneVerify: '',
        name: '',
        surname: '',
        password: '',
        passwordConfirm: '',
        position: 'Получатель чаевых',
        pfp: null,
        pin: '',
        pinConfirm: ''
    }

    const formik = useFormik(
        {
            initialValues,
            onSubmit: values => {
                alert(JSON.stringify(values))
                console.warn(values)
            },
            validationSchema: signupSchema
        })


    const handleSMS = (e: React.MouseEvent<HTMLButtonElement>) => {
        setStep(2)
    }
    const handleSmsPin = async (pin: string) => {
        console.log(pin)
        await formik.setFieldTouched('phoneVerify')
        if (pin[0] === '1') {
            formik.setFieldValue('phoneVerify', 'RANDOM_VERIFY_TOKEN')
            setStep(3)
        }
        else
            formik.setFieldError('phoneVerify', 'Неверный PIN')
    }

    const handleBack = () => {
        if (step < 1) return
        if (step === 3) return
        setStep(step - 1)
    }
    const handleNameSurname = () => {
        setStep(4)
    }
    const handlePassword = () => {
        setStep(5)
    }
    const handlePFP = async (file: File) => {
        await formik.setFieldTouched('pfp')
        await formik.setFieldValue('pfp', file)
    }
    const handlePositionAndPfp = () => {
        setStep(6)
    }
    const handleInitialPIN = async (pin: string) => {
        console.log(pin)
        await formik.setFieldTouched('pin')
        await formik.setFieldValue('pin', pin)
        setStep(7)
    }
    const handleRepeatPIN = async (pinConfirm: string) => {
        await formik.setFieldTouched('pinConfirm')
        await formik.setFieldValue('pinConfirm', pinConfirm)
        if (pinConfirm === formik.values.pin)
            setStep(8)
    }
    const showBack = step > 1 && step !== 3
    console.log(formik.values, formik.errors)
    return (
        <Layout title="Регистрация">
            <Card bigYpadding className="mb-4">
                {step !== 8 &&
                    <MultiStepControls handleBack={handleBack} showBack={showBack} currentStep={step} totalSteps={7} />
                }
                {step === 1 && (
                    <div className="flex flex-col gap-y-8">
                        <Input mask="+7 (999) 999-99-99" label="Номер телефона" placeholder="+7 (___) ___-__-__" type="tel" required
                            onChange={e =>
                                formik.setFieldValue('phone', formatPhoneNumber(e.target.value))}
                            onFocus={e => formik.setFieldTouched('phone')}
                            error={formik.errors?.phone}
                            value={formik.values.phone}
                            touched={formik.touched.phone}
                        />
                        <Button text='Отправить SMS' onClick={handleSMS} disabled={Boolean(formik.errors.phone?.length) || !formik.touched.phone} />
                    </div>
                )}
                {step === 2 && (
                    <div className="flex flex-col gap-y-8 items-center">
                        <PinInput title="Введите код из SMS" length={5} onComplete={handleSmsPin}
                            error={formik.errors.phoneVerify}
                            touched={formik.touched.phoneVerify} />

                        <TextButton text="Отправить повторно" />
                    </div>
                )}
                {step === 3 && (
                    <div className="flex flex-col gap-y-8 items-center">
                        <Input label="Имя" placeholder="Введите ваше имя" type="text" required
                            onFocus={e => formik.setFieldTouched('name')}
                            onChange={e =>
                                formik.setFieldValue('name', e.target.value)}
                            error={formik.errors?.name}
                            value={formik.values.name}
                            touched={formik.touched.name}

                        />
                        <Input label="Фамилия" placeholder="Введите вашу фамилию" type="text"
                            onFocus={e => formik.setFieldTouched('surname')}
                            onChange={e =>
                                formik.setFieldValue('surname', e.target.value)}
                            error={formik.errors?.surname}
                            value={formik.values.surname}
                            touched={formik.touched.surname}
                            required />
                        <Button text='Далее' onClick={handleNameSurname}
                            disabled={Boolean(formik.errors?.name) || Boolean(formik.errors?.surname)}
                        />
                    </div>
                )}
                {step === 4 && (
                    <div className="flex flex-col gap-y-8 items-center">
                        <Input label="Пароль" placeholder="Введите пароль" type="password" required
                            onFocus={e => formik.setFieldTouched('password')}
                            onChange={e =>
                                formik.setFieldValue('password', e.target.value)}
                            touched={formik.touched.password}
                            value={formik.values.password}
                            error={formik.errors.password}
                        />
                        <Input label="Повтор пароля" placeholder="Введите повтор пароля" type="password" required
                            onFocus={e => formik.setFieldTouched('passwordConfirm')}
                            onChange={e =>
                                formik.setFieldValue('passwordConfirm', e.target.value)}
                            value={formik.values.passwordConfirm}
                            touched={formik.touched.passwordConfirm}
                            error={formik.errors.passwordConfirm}
                        />
                        <Button text='Далее' onClick={handlePassword}
                            disabled={Boolean(formik.errors?.password) || Boolean(formik.errors?.passwordConfirm)}
                        />
                    </div>
                )}
                {step === 5 && (
                    <div className="flex flex-col gap-y-8 items-center">
                        <Input label="Должность" placeholder="Бариста" type="text"
                            onFocus={e => formik.setFieldTouched('position')}
                            onChange={e =>
                                formik.setFieldValue('position', e.target.value)}
                            touched={formik.touched.position}
                            value={formik.values.position}
                            error={formik.errors.position}
                        />
                        <ImageUpload label="Изображение профиля"
                            bottomLabel="Рекомендуемое соотношение сторон 1:1"
                            onChange={handlePFP}
                            touched={formik.touched.pfp}
                            error={formik.errors.pfp}
                            squareImg />
                        <Button text='Далее' onClick={handlePositionAndPfp}
                        disabled={Boolean(formik.errors.position) || Boolean(formik.errors.pfp)} />
                    </div>
                )}
                {step === 6 && (
                    <div className="flex flex-col gap-y-8 items-center">
                        <PinInput title="Придумайте PIN-код" type="password" length={5} onComplete={handleInitialPIN}
                            error={formik.errors.pin}
                            touched={formik.touched.pin}

                        />
                    </div>
                )}
                {step === 7 && (
                    <div className="flex flex-col gap-y-8 items-center">
                        <PinInput title="Повторите PIN-код" type="password" length={5} onComplete={handleRepeatPIN}
                            error={formik.errors.pinConfirm}
                            touched={formik.touched.pinConfirm}
                        />
                    </div>
                )}
                {step === 8 && (
                    <div className="flex flex-col gap-y-8 items-center">
                        <CompleteIcon />
                        <div>
                            <p className="font-bold text-2xl mb-2">Регистрация завершена!</p>
                            <p className="text-center text-gray-text">Войдите в аккаунт <br /> для использования сервиса</p>
                        </div>
                        <Button type="submit" text='Войти в аккаунт' onClick={() => { formik.handleSubmit() }} />
                    </div>
                )}



            </Card>
            {step !== 8 &&
                <p className="text-gray-text text-center">Регистрируясь в сервисе,<br />
                    вы соглашаетесь <a className="underline">с условиями</a></p>}
        </Layout>

    )
}
