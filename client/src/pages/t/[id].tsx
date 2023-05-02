import Button from "@/components/Button";
import Input from "@/components/Input";
import Card from "@/components/layouts/Card";
import Layout from "@/components/layouts/Layout";
import RoundButton from "@/components/RoundButton";
import Switch from "@/components/Switch";
import UserCard from "@/components/UserCard";
import { useFormik } from "formik";
import { GetServerSideProps } from 'next';


type Props = {
    tipLink: {
        user: {
            pfp: string,
            name: string,
            surname: string,
            position: string
        },
        min: number,
        max: number,
        banner: string,
        pageText: string,
        thankText: string,
        commisionAmount: number
    }
}

export default function tipLink({ tipLink }: Props) {
    const formik = useFormik(
        {
            initialValues: {
                tipAmount: '',
                comment: '',
                payOffCommision: false
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
    return (
        <Layout>
            <img className="absolute top-0 left-0 w-full h-48 bg-red-600" src="" alt="" />
            <div className="flex flex-col relative z-10 gap-y-8 mb-4">
                <UserCard fullname={`${tipLink.user.name} ${tipLink.user.surname}`} pfp={tipLink.user.pfp} position={tipLink.user.position} />
                <Card>
                    <div className="flex flex-col gap-y-8">
                        <h1 className="text-2xl font-bold text-center">{tipLink.pageText}</h1>
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

                        <Input label="Сумма чаевых" placeholder="Сумма чаевых" bottomLabel={`От ${tipLink.min} до ${tipLink.max}`} required
                            value={formik.values.tipAmount}
                            onChange={handleTipAmount}
                        />
                        <Input label="Комментарий" placeholder="Комментарий" />
                        <Switch text={`Погасить коммисию (${tipLink.commisionAmount} ₽)`} checked={formik.values.payOffCommision}
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

export const getServerSideProps: GetServerSideProps<Props> = async () => {
    return {
        props: {
            tipLink: {
                user: {
                    link: 'jci2c',
                    name: 'Александр',
                    pfp: 'test',
                    surname: 'Тихонов',
                    position: 'Бариста'
                },
                min: 50,
                max: 3000,
                commisionAmount: 4.46,
                banner: 'test',
                pageText: 'Оставьте чаевые',
                thankText: 'Спасибо!'
            }
        }
    }
}