import Button from "@/components/Button";
import Input from "@/components/Input";
import PinInput from "@/components/PinInput";
import TextButton from "@/components/TextButton";
import Card from "@/components/layouts/Card";
import Layout from "@/components/layouts/Layout";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from 'yup'
import { formatPhoneNumber } from '@/utils/formatPhoneNumber'
import { useRouter } from 'next/router';
import axiosInstance from "../utils/axios";
import Link from "next/link";
import CompleteIcon from "@/components/CompleteIcon";
import LoadingIcon from "@/components/LoadingIcon";
import MultiStepControls from "@/components/MultiStepControls";
import MoneyInput from "@/components/MoneyInput";
import Script from "next/script";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { formatMoney } from "@/utils/formatMoney";
import Head from "next/head";

type Props = {
    balance: number
    yookassa_agent_id: string,
    min_payout_amount: number,
    max_payout_amount: number
}


export default function Payout({ balance, yookassa_agent_id, max_payout_amount, min_payout_amount }: Props) {
    const maxAmount = balance > max_payout_amount ? min_payout_amount : balance

    const payoutSchema = Yup.object().shape({
        amount: Yup.number().required('Укажите сумму').min(min_payout_amount, `Минимальная сумма ${formatMoney(min_payout_amount)}`)
            .max(maxAmount, `Максимальная сумма ${formatMoney(maxAmount)}`),
        phoneVerificationId: Yup.string().required(),
        phoneVerify: Yup.string().required(),
        payoutToken: Yup.string().required()
    })

    const [step, setStep] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [widgetLoading, setWidgetLoading] = useState(true)
    const [cardData, setCardData] = useState<string>('')
    const router = useRouter()
    const payOutForm = useRef(null)

    const formik = useFormik(
        {
            initialValues: {
                amount: '',
                phoneVerificationId: '',
                phoneVerify: '',
                payoutToken: '',
                code: ''
            },
            onSubmit: values => {
                axiosInstance.post('/api/payouts', { ...values }).then(res => {
                    console.log(res)
                    setStep(5)
                }).catch(e => {
                    console.error(e)
                    formik.resetForm()
                    setStep(1)
                })
            },

            validationSchema: payoutSchema
        })



    useEffect(() => {
        if (step !== 3) return
        const payoutsData: any = new (window as any).PayoutsData({
            type: 'payout',
            account_id: yookassa_agent_id, //Идентификатор шлюза (agentId в личном кабинете)
            async success_callback(data: { payout_token: string, card_type?: string, first6?: string, last4?: string }) {
                console.log(data)
                await formik.setFieldValue('payoutToken', data.payout_token)
                setCardData(`${data?.card_type} ${data?.first6}*${data?.last4}`)
                setStep(4)
                //Обработка ответа с токеном карты
            },
            error_callback(error: unknown) {
                console.error(error)
                //Обработка ошибок инициализации
            }
        })

        //Отображение формы в контейнере

        payoutsData.render("payout-form")
            //Метод возвращает Promise, исполнение которого говорит о полной загрузке формы сбора данных (можно не использовать).
            .then(() => {
                setWidgetLoading(false)
                //Код, который нужно выполнить после отображения формы.
            });

        return () => {

        }

    }, [step])

    const handleBack = () => {
        if (step < 2) { router.back(); return }
        setStep(step - 1)
    }
    const handleExit = () => {
        router.push('/finance')
    }
    const handleAmountStep = () => {
        axiosInstance.post('/api/sms/send/me').then((res) => {
            formik.setFieldValue('phoneVerificationId', res.data.verificationId)
            console.log(res)
        }).catch((err) => {
            console.error(err)
            setStep(1)
        }).finally(() => {
            setLoading(false)
        })
        setStep(2)
    }

    const handleCode = async (code: string) => {
        setLoading(true)
        await formik.setFieldTouched('code')
        await axiosInstance.post('/api/sms/verify', {
            'verificationId': formik.values.phoneVerificationId,
            'code': code
        }).then(async (res) => {
            await formik.setFieldValue('phoneVerify', res.data.accessCode)
            console.log(formik.values)
            setStep(3)
        }).catch((err) => {
            console.error(err)
            formik.setFieldError('code', 'Неверный PIN')
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleAmount = async (value: number) => {
        await formik.setFieldTouched('amount')
        await formik.setFieldValue('amount', value)
    }
    const handlePayout = () => {
        formik.handleSubmit()
    }
    const showBack = step < 3
    return (
        <>
            <Script src="https://yookassa.ru/payouts-data/3.0.0/widget.js" />
            <Layout title="Запрос вывода средств" cleanHeader>
                <Card bigYpadding className="mb-4">
                    {step !== 5 &&
                        <MultiStepControls handleBack={handleBack} showBack={showBack} handleExit={handleExit} showExit currentStep={step} totalSteps={4} />}
                    {step === 1 && (
                        <div className="flex flex-col gap-y-8">
                            <MoneyInput
                                label="Сумма вывода"
                                onFocus={e => formik.setFieldTouched('amount')}
                                bottomLabel={`от ${formatMoney(min_payout_amount)} до ${formatMoney(maxAmount)}`}
                                placeholder="Сумма вывода"
                                maxValue={maxAmount}
                                error={formik.errors.amount}
                                onChange={handleAmount}
                                touched={formik.touched.amount}
                                required
                            />
                            <Button text='Отправить SMS' onClick={handleAmountStep} disabled={Boolean(formik.errors.amount) || !formik.touched.amount} />
                        </div>)}
                    {step === 2 && (
                        <div className="flex flex-col gap-y-8">
                            <PinInput title="Введите код из SMS" length={5} onComplete={handleCode}
                                error={formik.errors.code}
                                touched={formik.touched.code}
                                loading={loading} />

                            {/* <TextButton text="Отправить повторно" /> */}
                        </div>)}
                    {step === 3 && (
                        <div>
                            {widgetLoading && <div className="flex flex-col items-center justify-center">
                                <p className="text-2xl font-bold mb-4">Загрузка виджета...</p>
                                <LoadingIcon /></div>}
                            <div ref={payOutForm} id="payout-form"></div>
                        </div>
                    )}
                    {step === 4 && (
                        <div className="flex flex-col justify-center items-center gap-y-3">
                            <p className="font-bold text-lg">Подтвердите вывод средств</p>
                            <p>{cardData}</p>
                            <Button text="Вывести средства" onClick={handlePayout} disabled={!formik.isValid} />
                        </div>
                    )}
                    {step === 5 && (
                        <div className="flex flex-col justify-center items-center gap-y-3">
                            <CompleteIcon />
                            <p className="font-bold text-2xl mb-2">Запрос на вывод средств создан!</p>
                            <Link href="/finance">
                                <Button text="К финансам" />
                            </Link>
                        </div>
                    )}
                </Card>
            </Layout>

        </>

    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get('/finance/payout-data', {
            headers: ctx.req.headers
        })
        console.log(res.data)
        return {
            props: {
                balance: res.data.balance,
                yookassa_agent_id: res.data.yookassa_agent_id,
                max_payout_amount: res.data.max_payout_amount,
                min_payout_amount: res.data.min_payout_amount
            }
        }
    } catch (e) {
        console.error(e)
        return {
            props: {},
            redirect: {
                permanent: false,
                destination: "/signin"
            }
        }
    }
}

