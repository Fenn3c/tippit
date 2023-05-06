import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/layouts/Card";
import Layout from "@/components/layouts/Layout";
import RoundButton from "@/components/RoundButton";
import Switch from "@/components/Switch";
import UserCard from "@/components/UserCard";
import { useFormik } from "formik";
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axiosInstance from "../../../utils/axios";
import { formatCommission } from "@/utils/formatCommission";


type Props = {
    banner: string | null,
    pageText: string,
    thankText: string,
    minAmount: string,
    maxAmount: string,
    userName: string,
    userSurname: string,
    userPosition: string,
    userPfp: string | null,
    commissionPercent: number
}

export default function tipLink({ banner, pageText, thankText, minAmount, maxAmount, userName, userSurname, userPosition, userPfp, commissionPercent }: Props) {
    const formik = useFormik(
        {
            initialValues: {
                tipAmount: '',
                comment: '',
                payOffCommision: true
            },
            onSubmit: values => {
                alert(JSON.stringify(values))
                console.warn(values)
            },
        })


    const handleTipAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        formik.setFieldValue('tipAmount', value)
    }
    const handlePayOffCommision = (e: React.ChangeEvent<HTMLInputElement>) => {

        formik.setFieldValue('payOffCommision', !formik.values.payOffCommision)
    }
    const minAmountConverted = Math.round(+minAmount / 100)
    const maxAmountConverted = Math.round(+maxAmount / 100)
    const calculatedCommision = formatCommission((+formik.values.tipAmount ?? 0) / 100 * commissionPercent)

    return (
        <Layout cleanHeader>
            <img className="absolute top-16 left-0 w-full h-48 bg-blue-100" src={banner ? `${process.env.NEXT_PUBLIC_STATIC_HOST}/${banner}` : 'test'} alt="" />
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
                            <div className="overflow-x-scroll">
                                <div className="flex gap-x-2">
                                    <RoundButton text="+50 ₽" />
                                    <RoundButton text="+100 ₽" />
                                    <RoundButton text="+200 ₽" />
                                    <RoundButton text="+300 ₽" />
                                    <RoundButton text="+400 ₽" />
                                    <RoundButton text="+500 ₽" />
                                    <RoundButton text="+1000 ₽" />
                                </div>
                            </div>
                        </div>

                        <Input label="Сумма чаевых" placeholder="Сумма чаевых" bottomLabel={`От ${minAmountConverted} до ${maxAmountConverted}`} required
                            value={formik.values.tipAmount}
                            onChange={handleTipAmount}
                        />
                        <Input label="Комментарий" placeholder="Комментарий" />
                        <Switch text={`Погасить коммисию (${calculatedCommision} ₽)`} checked={formik.values.payOffCommision}
                            onChange={handlePayOffCommision} />
                        <Button text="Перейти к оплате" />
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

        const commissionPercent = (await axiosInstance.get(`/commision-percent`)).data
        // console.log(res.data, commisionPercent)
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
