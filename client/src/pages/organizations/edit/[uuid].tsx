import Button from "@/components/Button";
import CompleteIcon from "@/components/CompleteIcon";
import ImageUpload from "@/components/ImageUpload";
import Input from "@/components/Input";
import MultiStepControls from "@/components/MultiStepControls";
import Card from "@/components/layouts/Card";
import Layout from "@/components/layouts/Layout";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import * as Yup from 'yup'
import axiosInstance from "../../../utils/axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import MoneyInput from "@/components/MoneyInput";
import { formatMoney } from "@/utils/formatMoney";

type Props = {
    uuid: string,
    name: string,
    banner: string | null,
    pageText: string,
    thankText: string,
    minAmount: number,
    maxAmount: number,
}


const editTipLinkSchema = Yup.object().shape({
    name: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    pageText: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    thankText: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    minAmount: Yup.number().required('Укажите сумму').min(5000, `Минимальная сумма ${formatMoney(5000)}`)
        .max(300000, `Максимальная сумма ${formatMoney(300000)}`),
    maxAmount: Yup.number().required('Укажите сумму').max(5000, `Минимальная сумма ${formatMoney(5000)}`)
        .max(300000, `Максимальная сумма ${formatMoney(300000)}`),

    banner: Yup.mixed().test(
        'fileFormat',
        'Файл должен быть в формате jpg, jpeg или png',
        (value) => {
            if (!value) return true // Разрешаем пустые значения
            const acceptedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
            console.log(value)
            return value instanceof File && acceptedFormats.includes(value.type);
        }
    ).nullable()
})

export default function EditTipLink({ uuid, name, banner, pageText, thankText, minAmount, maxAmount }: Props) {
    const [step, setStep] = useState<number>(1)
    const [touchedFields, setTouchedFields] = useState<any>({})
    const router = useRouter()

    const initialValues = {
        name: name,
        banner: null,
        pageText: pageText,
        thankText: thankText,
        minAmount: minAmount,
        maxAmount: maxAmount
    }

    const formik = useFormik(
        {
            initialValues,
            onSubmit: values => {
                console.log(touchedFields)
                const formData = new FormData()
                if (touchedFields.name) formData.append('name', values.name)
                if (touchedFields.pageText) formData.append('pageText', values.pageText)
                if (touchedFields.thankText) formData.append('thankText', values.thankText)
                if (touchedFields.minAmount) formData.append('minAmount', values.minAmount.toString())
                if (touchedFields.maxAmount) formData.append('maxAmount', values.maxAmount.toString())
                if (touchedFields.banner && values.banner) formData.append('banner', values.banner)

                axiosInstance.patch(`/api/organizations/${uuid}`, formData).then(res => {
                    setStep(4)
                }).catch(err => {
                    console.error(err)
                    setStep(1)
                })
            },
            validationSchema: editTipLinkSchema
        })
    const handleBack = () => {
        if (step === 1) router.back()
        if (step < 2) return
        setStep(step - 1)
    }
    const handleExit = () => {
        router.back()
    }
    const handleBanner = async (file: File) => {
        await formik.setFieldTouched('banner')
        await formik.setFieldValue('banner', file)
    }


    const handleNameAndBanner = () => {
        setStep(2)
    }

    const handlePageAndThankText = () => {
        setStep(3)
    }
    const handleSubmit = () => {
        setTouchedFields(formik.touched)
        formik.handleSubmit()
    }

    return (
        <Layout title="Изменение организации">
            <Card bigYpadding className="mb-4">
                {step !== 4 && <MultiStepControls handleBack={handleBack} handleExit={handleExit} showBack showExit currentStep={step} totalSteps={3} />}

                {step === 1 && (
                    <div className="flex flex-col gap-y-8">
                        <Input label="Название организации" placeholder="Название организации" type="text" required
                            onFocus={e => formik.setFieldTouched('name')}
                            onChange={e =>
                                formik.setFieldValue('name', e.target.value)}
                            error={formik.errors?.name}
                            value={formik.values.name}
                            touched={formik.touched.name}

                        />

                        <ImageUpload label="Изображение"
                            bottomLabel="Рекомендуемое разрешение 393x184 px"
                            onChange={handleBanner}
                            touched={formik.touched.banner}
                            error={formik.errors.banner}
                            initialFile={formik.values.banner}
                            initialLink={banner}
                        />

                        <Button onClick={handleNameAndBanner}
                            text='Далее' disabled={Boolean(formik.errors.name?.length) || Boolean(formik.errors.banner?.length)} />
                    </div>
                )}


                {step === 2 && (
                    <div className="flex flex-col gap-y-8">
                        <Input label="Текст на странице чаевых" placeholder="Текст на странице чаевых" type="text" required
                            onFocus={e => formik.setFieldTouched('pageText')}
                            onChange={e =>
                                formik.setFieldValue('pageText', e.target.value)}
                            error={formik.errors?.pageText}
                            value={formik.values.pageText}
                            touched={formik.touched.pageText}
                        />

                        <Input label="Текст благодарности" placeholder="Текст благодарности" type="text" required
                            onFocus={e => formik.setFieldTouched('thankText')}
                            onChange={e =>
                                formik.setFieldValue('thankText', e.target.value)}
                            error={formik.errors?.thankText}
                            value={formik.values.thankText}
                            touched={formik.touched.thankText}
                        />

                        <Button onClick={handlePageAndThankText}
                            text='Далее' disabled={Boolean(formik.errors.pageText?.length) || Boolean(formik.errors.thankText?.length)} />
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-y-8">
                        <MoneyInput label="Минимальная сумма чаевых" placeholder="Минимальная сумма чаевых" required
                            onFocus={e => formik.setFieldTouched('minAmount')}
                            onChange={value =>
                                formik.setFieldValue('minAmount', value)}
                            error={formik.errors?.minAmount}
                            initialValue={formik.values.minAmount}
                            touched={formik.touched.minAmount}
                        />

                        <MoneyInput label="Максимальная сумма чаевых" placeholder="Максимальная сумма чаевых" required
                            onFocus={e => formik.setFieldTouched('maxAmount')}
                            onChange={value =>
                                formik.setFieldValue('maxAmount', value)}
                            error={formik.errors?.maxAmount}
                            initialValue={formik.values.maxAmount}
                            touched={formik.touched.maxAmount}
                        />

                        <Button onClick={handleSubmit}
                            text='Изменить' disabled={!formik.isValid} />
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col gap-y-8 items-center text-center ">
                        <CompleteIcon />
                        <div>
                            <p className="font-bold text-2xl mb-2">Организация изменена!</p>
                            <p className="text-center text-gray-text">Теперь вы можете принимать чаевые</p>
                        </div>
                        <Link href="/organizations">
                            <Button type="submit" text='К организациям' />
                        </Link>
                    </div>
                )}


            </Card>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get(`/organizations/${ctx.query.uuid}`, {
            headers: ctx.req.headers
        })
        return {
            props: {
                uuid: res.data.uuid,
                name: res.data.tipLinkData.name,
                banner: res.data.tipLinkData.banner,
                pageText: res.data.tipLinkData.page_text,
                thankText: res.data.tipLinkData.thank_text,
                minAmount: res.data.tipLinkData.min_amount,
                maxAmount: res.data.tipLinkData.max_amount
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
