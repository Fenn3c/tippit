import AddTipLinkButton from '@/components/AddTipLinkButton';
import ModalButton from '@/components/ModalButton';
import TipLink from '@/components/QrCard';
import Layout from '@/components/layouts/Layout'
import Modal from '@/components/layouts/Modal';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axiosInstance from '../utils/axios';
import Card from '@/components/layouts/Card';
import TextButton from '@/components/TextButton';
import ProfileIcon from '@/components/ProfileIcon';
import ExitIcon from '@/components/ExitIcon';
import * as Yup from 'yup'
import { useFormik } from 'formik';
import Input from '@/components/Input';
import ImageUpload from '@/components/ImageUpload';
import Button from '@/components/Button';
import MultiStepControls from '@/components/MultiStepControls';



type Props = {
    id: string,
    phone: string,
    pfp: string | null,
    name: string,
    surname: string,
    position: string,
}

const editProfileSchema = Yup.object().shape({
    name: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    surname: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    position: Yup.string().required('Обязательное поле'),
    pfp: Yup.mixed().test(
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


export default function EditProfile({ id, phone, name, surname, position, pfp }: Props) {
    const initialValues = {
        name: name,
        surname: surname,
        position: position,
        pfp: null,
    }
    const [touchedFields, setTouchedFields] = useState<any>({})


    const formik = useFormik(
        {
            initialValues,
            onSubmit: values => {
                console.log(touchedFields)
                const formData = new FormData()
                if (touchedFields.name) formData.append('name', values.name)
                if (touchedFields.surname) formData.append('surname', values.surname)
                if (touchedFields.position) formData.append('position', values.position)
                if (touchedFields.pfp && values.pfp) formData.append('pfp', values.pfp)



                axiosInstance.patch(`/api/users`, formData).then(res => {
                    router.reload()
                }).catch(err => {
                    console.error(err)
                })

            },
            validationSchema: editProfileSchema
        })



    const router = useRouter()
    const handlePFP = async (file: File) => {
        await formik.setFieldTouched('pfp')
        await formik.setFieldValue('pfp', file)
    }

    const handleSubmit = () => {
        setTouchedFields(formik.touched)
        formik.handleSubmit()
    }
    return (
        <>
            <Layout title="Настройки пользователя">
                <Card>
                <MultiStepControls handleBack={() => {router.back()}} handleExit={() => router.back()} showBack showExit />
                    <div className="flex flex-col gap-y-8">

                        <Input label="Имя" placeholder="Имя пользователя" type="text" required
                            onFocus={e => formik.setFieldTouched('name')}
                            onChange={e =>
                                formik.setFieldValue('name', e.target.value)}
                            error={formik.errors?.name}
                            value={formik.values.name}
                            touched={formik.touched.name}
                        />
                        <Input label="Фамилия" placeholder="Фамилия пользователя" type="text" required
                            onFocus={e => formik.setFieldTouched('surname')}
                            onChange={e =>
                                formik.setFieldValue('surname', e.target.value)}
                            error={formik.errors?.surname}
                            value={formik.values.surname}
                            touched={formik.touched.surname}
                        />
                        <Input label="Должность" placeholder="Бариста" type="text" required
                            onFocus={e => formik.setFieldTouched('position')}
                            onChange={e =>
                                formik.setFieldValue('position', e.target.value)}
                            error={formik.errors?.position}
                            value={formik.values.position}
                            touched={formik.touched.position}
                        />

                        <ImageUpload label="Изображение профиля"
                            bottomLabel="Рекомендуемое соотношение строн 1:1"
                            onChange={handlePFP}
                            touched={formik.touched.pfp}
                            error={formik.errors.pfp}
                            initialFile={formik.values.pfp}
                            initialLink={pfp}
                        />
                        <Button onClick={handleSubmit} text='Сохранить изменения' disabled={!formik.isValid || !Boolean(Object.keys(formik.touched).length)} />
                      <Link href="edit-password">
                        <Button text='Изменить пароль' />
                      </Link>

                    </div>

                </Card>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get('/users/me', {
            headers: ctx.req.headers
        })
        return {
            props: {
                id: res.data.id,
                name: res.data.name,
                surname: res.data.surname,
                pfp: res.data.pfp,
                phone: res.data.phone,
                position: res.data.position
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

