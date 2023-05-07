import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/layouts/Card";
import Layout from "@/components/layouts/Layout";
import RoundButton from "@/components/RoundButton";
import Switch from "@/components/Switch";
import UserCard from "@/components/UserCard";
import { useFormik } from "formik";
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { formatCommission } from "@/utils/formatCommission";
import axiosInstance from "@/utils/axios";
import * as Yup from 'yup'
import { useRouter } from "next/router";

const CURRENCY_SUFFICS = ' ₽'

type Props = {
    uuid: string
    banner: string | null,
    pageText: string,
    thankText: string,
    minAmount: number,
    maxAmount: number,
    userName: string,
    userSurname: string,
    userPosition: string,
    userPfp: string | null,
    commissionPercent: number
}


const clearAmountValue = (val: string): number => Number(val.replace(/\D/g, ''))

export default function tipLink({ uuid, banner, pageText, thankText, minAmount, maxAmount, userName, userSurname, userPosition, userPfp, commissionPercent }: Props) {
    const router = useRouter()
    const minAmountConverted = Math.round(+minAmount / 100)
    const maxAmountConverted = Math.round(+maxAmount / 100)
    const tipPaySchema = Yup.object().shape({
        comment: Yup.string().min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
        amount: Yup.string().required('Укажите сумму').test('min', `Сумма не должна быть меньше ${minAmountConverted} ₽`, (value) => {
            return clearAmountValue(value) >= minAmountConverted
        }).test('max', `Сумма не должна быть больше ${maxAmountConverted} ₽`, (value) => {
            return clearAmountValue(value) <= maxAmountConverted
        }),
        payOffCommission: Yup.boolean(),
        tipLinkUUID: Yup.string().required()
    })
    const formik = useFormik(
        {
            initialValues: {
                amount: '',
                comment: '',
                payOffCommision: true,
                tipLinkUUID: uuid
            },
            onSubmit: values => {
                const amountMinimalMonetaryUnits = clearAmountValue(values.amount) * 100
                axiosInstance.post('/api/payments', {
                    amount: amountMinimalMonetaryUnits,
                    comment: values.comment,
                    payOffCommission: values.payOffCommision,
                    tipLinkUUID: values.tipLinkUUID
                }).then(res => {
                    router.push(res.data.payment_link)
                }).catch(err => {
                    console.error(err)
                    router.reload()
                })
            },
            validationSchema: tipPaySchema
        })

    const calculatedCommision = formatCommission((clearAmountValue(formik.values.amount) ?? 0) / 100 * commissionPercent)
    const handleTipAmount = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target) return
        let cleanValue = clearAmountValue(e.target.value)
        const value = cleanValue + CURRENCY_SUFFICS;
        setTimeout(() => {
            e.target.selectionEnd = e.target.selectionEnd = e.target.value.length - CURRENCY_SUFFICS.length
        })
        await formik.setFieldValue('amount', value)
    }
    const handlePayOffCommision = (e: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('payOffCommision', !formik.values.payOffCommision)
    }
    const handleAddButton = async (amount: number) => {
        let cleanValue = clearAmountValue(formik.values.amount)
        cleanValue += amount
        const value = cleanValue + CURRENCY_SUFFICS;
        await formik.setFieldValue('amount', value)
    }

    return (
        <Layout cleanHeader>
            {banner ?
                <img className="fixed top-16 left-0 w-screen h-48 bg-blue-100" src={`${process.env.NEXT_PUBLIC_STATIC_HOST}/${banner}`} alt="" /> :
                <div className="fixed top-16 left-0 w-screen h-48 bg-blue-100" />
            }
            <div className="flex flex-col relative z-10 gap-y-8 mb-4">
                <UserCard fullname={`${userName} ${userSurname}`} pfp={userPfp} position={userPosition} />
                <Card>
                    <div className="flex flex-col gap-y-8">
                        <h1 className="text-2xl font-bold text-center">{pageText}</h1>
                        <div className="relative
                        after:content-['']
                        after:right-0
                        after:top-0
                        after:block
                        after:absolute
                        after:w-4 
                        after:h-full 
                        after:bg-gradient-to-l
                        after:from-main-white">
                            <div className="overflow-x-scroll hide-scrollbar">
                                <div className="flex gap-x-2">
                                    <RoundButton text="+50 ₽" onClick={() => handleAddButton(50)} />
                                    <RoundButton text="+100 ₽" onClick={() => handleAddButton(100)} />
                                    <RoundButton text="+200 ₽" onClick={() => handleAddButton(200)} />
                                    <RoundButton text="+300 ₽" onClick={() => handleAddButton(300)} />
                                    <RoundButton text="+400 ₽" onClick={() => handleAddButton(400)} />
                                    <RoundButton text="+500 ₽" onClick={() => handleAddButton(500)} />
                                    <RoundButton text="+1000 ₽" onClick={() => handleAddButton(1000)} />
                                </div>
                            </div>
                        </div>

                        <Input label="Сумма чаевых" placeholder="Сумма чаевых" bottomLabel={`От ${minAmountConverted} до ${maxAmountConverted}`} required
                            onFocus={e => formik.setFieldTouched('amount')}
                            onChange={handleTipAmount}
                            error={formik.errors?.amount}
                            value={formik.values.amount}
                            touched={formik.touched.amount}
                            numberic
                        />
                        <Input label="Комментарий" placeholder="Комментарий"
                            onFocus={e => formik.setFieldTouched('comment')}
                            onChange={e =>
                                formik.setFieldValue('comment', e.target.value)}
                            error={formik.errors?.comment}
                            value={formik.values.comment}
                            touched={formik.touched.comment}
                        />
                        <Switch text={`Погасить коммисию (${calculatedCommision} ₽)`} checked={formik.values.payOffCommision}
                            onChange={handlePayOffCommision} />
                        <Button onClick={() => formik.handleSubmit()} text="Перейти к оплате" disabled={!formik.isValid} />
                    </div>
                </Card>
            </div>
            <p className="text-gray-text text-center">Нажимая кнопку оплаты,<br /> вы соглашаетесь
                <a className="underline">с условиями</a></p>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get(`/tip-links/${ctx.query.id}`, {
            headers: ctx.req.headers
        })

        const commissionPercent = (await axiosInstance.get(`/payments/commission-percent`)).data
        return {
            props: {
                uuid: res.data.uuid,
                banner: res.data.banner,
                pageText: res.data.page_text,
                thankText: res.data.thank_text,
                minAmount: res.data.min_amount,
                maxAmount: res.data.max_amount,
                userName: res.data.user.name,
                userSurname: res.data.user.surname,
                userPosition: res.data.user.position,
                userPfp: res.data.user.pfp,
                commissionPercent: commissionPercent
            }
        }
    } catch (e) {
        console.error(e)
        return {
            props: {},
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }
}
