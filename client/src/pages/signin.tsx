import Button from "@/components/Button";
import Input from "@/components/Input";
import PinInput from "@/components/PinInput";
import TextButton from "@/components/TextButton";
import Card from "@/components/layouts/Card";
import Layout from "@/components/layouts/Layout";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from 'yup'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'


const signupSchema = Yup.object().shape({
    phone: Yup.string().required('Обязательное поле').matches(/^[78]\d{10}$/, 'Неверный формат номера'),
    password: Yup.string().required('Обязательное поле').min(8, 'Минимально 8 символов').max(32, 'Максимально 32 символа'),
})
export default function SignIn() {
    const [step, setStep] = useState<1 | 2>(1)
    
    const loginFormik = useFormik(
        {
            initialValues: {
                phone: '',
                password: '',
                phoneVerify: ''
            },
            onSubmit: values => {
                alert(JSON.stringify(values))
                console.warn(values)
            },
            validationSchema: signupSchema
        })


    
    const handleLogin = () => {
        // Отправляю логин пароль без телефона
        // возращает ошибку с либо с ошибкой входа либо с номером подтверждения телефона
        setStep(2)
    }
    const handleSMS = (code: string) => {
        // api/singin

    }
    return (
        <Layout title="Вход">
            <Card bigYpadding className="mb-4">
                {step === 1 && (
                    <div className="flex flex-col gap-y-8">
                        <Input mask="+7 (999) 999-99-99" label="Номер телефона" placeholder="+7 (___) ___-__-__" type="tel" required
                            onChange={e =>
                                loginFormik.setFieldValue('phone', formatPhoneNumber(e.target.value))}
                            onFocus={e => loginFormik.setFieldTouched('phone')}
                            error={loginFormik.errors?.phone}
                            value={loginFormik.values.phone}
                            touched={loginFormik.touched.phone}
                        />
                        <Input label="Пароль" placeholder="Введите пароль" type="password" required
                            onFocus={e => loginFormik.setFieldTouched('password')}
                            onChange={e =>
                                loginFormik.setFieldValue('password', e.target.value)}
                            touched={loginFormik.touched.password}
                            value={loginFormik.values.password}
                            error={loginFormik.errors.password}
                        />
                        <Button text='Войти' onClick={() => loginFormik.handleSubmit} disabled={Boolean(loginFormik.errors.phone?.length) || !loginFormik.touched.phone} />
                    </div>)}
                {step === 2 && (
                    <div className="flex flex-col gap-y-8">
                        <PinInput title="Введите код из SMS" length={5} onComplete={handleSmsPin}
                            error={formik.errors.phoneVerify}
                            touched={formik.touched.phoneVerify} />

                        <TextButton text="Отправить повторно" />
                        <Button text='Войти' onClick={() => loginFormik.handleSubmit} disabled={Boolean(loginFormik.errors.phone?.length) || !loginFormik.touched.phone} />
                    </div>)}



            </Card>
        </Layout>

    )
}
