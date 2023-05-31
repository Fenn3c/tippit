import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/layouts/Card";
import Layout from "@/components/layouts/Layout";
import RoundButton from "@/components/RoundButton";
import Switch from "@/components/Switch";
import UserCard from "@/components/UserCard";
import { useFormik } from "formik";
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axiosInstance from "@/utils/axios";
import * as Yup from 'yup'
import { useRouter } from "next/router";
import { formatMoney } from "@/utils/formatMoney";
import MoneyInput from "@/components/MoneyInput";

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



export default function tipLink({ uuid, banner, pageText, thankText, minAmount, maxAmount, userName, userSurname, userPosition, userPfp, commissionPercent }: Props) {
    const router = useRouter()
    const tipPaySchema = Yup.object().shape({
        comment: Yup.string().min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
        amount: Yup.number().required('Укажите сумму').min(minAmount, `Минимальная сумма ${formatMoney(minAmount)}`)
            .max(maxAmount, `Максимальная сумма ${formatMoney(maxAmount)}`),
        payOffCommission: Yup.boolean(),
        tipLinkUUID: Yup.string().required()
    })
    const formik = useFormik(
        {
            initialValues: {
                amount: 0,
                comment: '',
                payOffCommision: true,
                tipLinkUUID: uuid
            },
            onSubmit: values => {
                // const amountMinimalMonetaryUnits = clearAmountValue(values.amount) * 100

                axiosInstance.post('/api/payments', {
                    amount: values.amount,
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

    const calculatedCommision = formatMoney(formik.values.amount / 100 * commissionPercent)
    const handleTipAmount = async (value: number) => {
        await formik.setFieldValue('amount', value)
    }
    const handlePayOffCommision = (e: React.ChangeEvent<HTMLInputElement>) => {
        formik.setFieldValue('payOffCommision', !formik.values.payOffCommision)
    }
    const handleAddButton = async (amount: number) => {
        const newAmount = formik.values.amount + amount
        await formik.setFieldValue('amount', newAmount)
        await formik.setFieldTouched('amount')
    }

    return (
        <Layout cleanHeader>
            {banner ?
                <img className="fixed top-16 left-0 w-screen h-48 bg-blue-100 object-cover" src={`${process.env.NEXT_PUBLIC_STATIC_HOST}/${banner}`} alt="" /> :
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
                                    <RoundButton text={`+${formatMoney(5000)}`} onClick={() => handleAddButton(5000)} />
                                    <RoundButton text={`+${formatMoney(10000)}`} onClick={() => handleAddButton(10000)} />
                                    <RoundButton text={`+${formatMoney(20000)}`} onClick={() => handleAddButton(20000)} />
                                    <RoundButton text={`+${formatMoney(30000)}`} onClick={() => handleAddButton(30000)} />
                                    <RoundButton text={`+${formatMoney(40000)}`} onClick={() => handleAddButton(40000)} />
                                    <RoundButton text={`+${formatMoney(50000)}`} onClick={() => handleAddButton(50000)} />
                                    <RoundButton text={`+${formatMoney(60000)}`} onClick={() => handleAddButton(100000)} />
                                </div>
                            </div>
                        </div>

                        <MoneyInput label="Сумма чаевых" placeholder="Сумма чаевых" bottomLabel={`От ${formatMoney(minAmount)} до ${formatMoney(maxAmount)}`} required
                            onFocus={e => formik.setFieldTouched('amount')}
                            onChange={handleTipAmount}
                            error={formik.errors?.amount}
                            initialValue={formik.values.amount}
                            touched={formik.touched.amount}
                        />
                        <Input label="Комментарий" placeholder="Комментарий"
                            onFocus={e => formik.setFieldTouched('comment')}
                            onChange={e =>
                                formik.setFieldValue('comment', e.target.value)}
                            error={formik.errors?.comment}
                            value={formik.values.comment}
                            touched={formik.touched.comment}
                        />
                        <Switch text={`Погасить коммисию (${calculatedCommision})`} checked={formik.values.payOffCommision}
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

        const commissionPercent = (await axiosInstance.get(`/finance/commission-percent`)).data
        const position = res.data?.employee?.position ? res.data.employee.position : res.data.user.position;
        return {
            props: {
                uuid: res.data.uuid,
                banner: res.data.tipLinkData.banner,
                pageText: res.data.tipLinkData.page_text,
                thankText: res.data.tipLinkData.thank_text,
                minAmount: res.data.tipLinkData.min_amount,
                maxAmount: res.data.tipLinkData.max_amount,
                userName: res.data.user.name,
                userSurname: res.data.user.surname,
                userPosition: position,
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
