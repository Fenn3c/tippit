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
import axios, { AxiosError } from "axios";
import { useRouter } from 'next/router';


const signupSchema = Yup.object().shape({
    phone: Yup.string().required('Обязательное поле').matches(/^[78]\d{10}$/, 'Неверный формат номера'),
    password: Yup.string().required('Обязательное поле').min(8, 'Минимально 8 символов').max(32, 'Максимально 32 символа'),
})
export default function SignIn() {
    const [step, setStep] = useState<1 | 2>(1)
    const [error, setError] = useState<string | null>(null)
    const [verificationId, setVerificationId] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const loginFormik = useFormik(
        {
            initialValues: {
                code: '',
                phone: '',
                password: '',
            },
            onSubmit: values => {
                setLoading(true)
                // alert(JSON.stringify(values))
                axios.post('/auth/signin-sms', values).then(res => {
                    setVerificationId(res.data.verificationId)
                    setStep(2)
                    setLoading(false)
                }).catch((err: any) => {
                    setError(err.response?.data.message)
                }).finally(() => {
                    setLoading(false)
                })
            },
            validationSchema: signupSchema
        })


    const handleLogin = () => {
        loginFormik.handleSubmit()

    }
    const handleSMS = async (code: string) => {
        setLoading(true)
        await axios.post('/sms/verify', {
            'verificationId': verificationId,
            'code': code
        }).then((res) => {
            console.log(res)
            axios.post('/auth/signin', {
                phone: loginFormik.values.phone,
                password: loginFormik.values.password,
                phoneVerificationId: verificationId,
                phoneVerify: res.data.accessCode
            }).then(res => {
                router.push('/')
                localStorage.setItem('token', res.data.token);
                // alert(res.data.token)

            }).catch(err => {
                console.error(err)
            })
        }).catch((err) => {
            console.error(err)
            loginFormik.setFieldError('code', 'Неверный PIN')
        }).finally(() => {
            setLoading(false)
        })

    }
    return (
        <Layout title="Вход">
            <Card bigYpadding className="mb-4">
                {step === 1 && (
                    <div className="flex flex-col gap-y-8">
                        {error && <p className="text-error">{error}</p>}
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
                        <Button text='Войти' onClick={handleLogin}
                            disabled={Boolean(loginFormik.errors.phone?.length) || !loginFormik.touched.phone || loading} />
                    </div>)}
                {step === 2 && (
                    <div className="flex flex-col gap-y-8">
                        <PinInput title="Введите код из SMS" length={5} onComplete={handleSMS}
                            error={loginFormik.errors.code}
                            touched={loginFormik.touched.code} loading={loading} />

                        {/* <TextButton text="Отправить повторно" /> */}
                    </div>)}



            </Card>
        </Layout>

    )
}
