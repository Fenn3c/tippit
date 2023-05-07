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
import axiosInstance from "../utils/axios";


const createTipLinkSchema = Yup.object().shape({
    name: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    pageText: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    thankText: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    minAmount: Yup.number().required('Обязательное поле').typeError('Минимальная сумма должна быть числом').max(3000),
    maxAmount: Yup.number().required('Обязательное поле').typeError('Максимальная сумма должна быть числом').min(50),

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

export default function CreateTipLink() {
    const [step, setStep] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const initialValues = {
        name: 'Новая ссылка',
        banner: null,
        pageText: 'Оставьте чаевые',
        thankText: 'Спасибо!',
        minAmount: '50',
        maxAmount: '3000'
    }

    const formik = useFormik(
        {
            initialValues,
            onSubmit: values => {
                const formData = new FormData()
                formData.append('name', values.name)
                formData.append('pageText', values.pageText)
                formData.append('thankText', values.thankText)
                formData.append('minAmount', `${Number(values.minAmount) * 100}`)
                formData.append('maxAmount', `${Number(values.maxAmount) * 100}`)
                if (values.banner) formData.append('banner', values.banner)
                axiosInstance.post('/api/tip-links', formData).then(res => {
                    setStep(4)
                }).catch(err => {
                    console.error(err)
                    setStep(1)
                })


            },
            validationSchema: createTipLinkSchema
        })
    const handleBack = () => {
        if (step === 1) router.push('/')
        if (step < 2) return
        setStep(step - 1)
    }
    const handleExit = () => {
       router.push('/')
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
        formik.handleSubmit()
    }

    return (
        <Layout title="Создание ссылки">
            <Card bigYpadding className="mb-4">
                {step !== 4 && <MultiStepControls handleBack={handleBack} handleExit={handleExit} showBack showExit currentStep={step} totalSteps={3} />}

                {step === 1 && (
                    <div className="flex flex-col gap-y-8">
                        <Input label="Название" placeholder="Название страницы чаевых" type="text" required
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
                            initialFile={formik.values.banner} />

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
                        <Input label="Минимальная сумма чаевых" placeholder="Минимальная сумма чаевых" type="text" required
                            onFocus={e => formik.setFieldTouched('minAmount')}
                            onChange={e =>
                                formik.setFieldValue('minAmount', e.target.value)}
                            error={formik.errors?.minAmount}
                            value={formik.values.minAmount}
                            touched={formik.touched.minAmount}
                        />

                        <Input label="Максимальная сумма чаевых" placeholder="Максимальная сумма чаевых" type="text" required
                            onFocus={e => formik.setFieldTouched('minAmount')}
                            onChange={e =>
                                formik.setFieldValue('maxAmount', e.target.value)}
                            error={formik.errors?.maxAmount}
                            value={formik.values.maxAmount}
                            touched={formik.touched.maxAmount}
                        />

                        <Button onClick={handleSubmit}
                            text='Создать' disabled={!formik.isValid} />
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col gap-y-8 items-center text-center ">
                        <CompleteIcon />
                        <div>
                            <p className="font-bold text-2xl mb-2">Ссылка создана!</p>
                            <p className="text-center text-gray-text">Теперь вы можете принимать чаевые</p>
                        </div>
                        <Link href="/">
                            <Button type="submit" text='На главную' />
                        </Link>
                    </div>
                )}


            </Card>
        </Layout>

    )
}
