import AddTipLinkButton from '@/components/AddTipLinkButton';
import ModalButton from '@/components/ModalButton';
import TipLink from '@/components/TipLink';
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
}

const editProfileSchema = Yup.object().shape({
    password: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    newPassword: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
    newPasswordConfirm: Yup.string().required('Обязательное поле').oneOf([Yup.ref('newPassword')], 'Пароли не совпадают'),

})


export default function EditProfile({ }: Props) {
    const [error, setError] = useState<string | null>(null)

    const initialValues = {
        password: '',
        newPassword: '',
        newPasswordConfirm: ''
    }

    const formik = useFormik(
        {
            initialValues,
            onSubmit: values => {
                axiosInstance.patch(`/api/users/password`, {
                    password: values.password,
                    newPassword: values.newPassword,
                    newPasswordConfirm: values.newPasswordConfirm
                }).then(res => {
                    axiosInstance.post('/api/auth/exit').then((res) => {
                        router.reload()
                    }).finally(() => router.reload())
                }).catch(err => {
                    setError(err.response?.data.message)
                    console.error(err)
                })

            },
            validationSchema: editProfileSchema
        })



    const router = useRouter()

    const handleSubmit = () => {
        formik.handleSubmit()
    }
    return (
        <>
            <Layout title="Изменение пароля">
                <Card>
                    <MultiStepControls handleBack={() => { router.back() }} handleExit={() => router.back()} showBack showExit />
                    {error && <p className="text-error">{error}</p>}

                    <div className="flex flex-col gap-y-8">

                        <Input label="Старый пароль" placeholder="Ваш пароль" type="password" required
                            onFocus={e => formik.setFieldTouched('password')}
                            onChange={e =>
                                formik.setFieldValue('password', e.target.value)}
                            error={formik.errors?.password}
                            value={formik.values.password}
                            touched={formik.touched.password}
                        />
                        <Input label="Новый пароль" placeholder="Придумайте новый пароль" type="password" required
                            onFocus={e => formik.setFieldTouched('newPassword')}
                            onChange={e =>
                                formik.setFieldValue('newPassword', e.target.value)}
                            error={formik.errors?.newPassword}
                            value={formik.values.newPassword}
                            touched={formik.touched.newPassword}
                        />
                        <Input label="Повторите новый пароль" placeholder="Повторите новый пароль" type="password" required
                            onFocus={e => formik.setFieldTouched('newPasswordConfirm')}
                            onChange={e =>
                                formik.setFieldValue('newPasswordConfirm', e.target.value)}
                            error={formik.errors?.newPasswordConfirm}
                            value={formik.values.newPasswordConfirm}
                            touched={formik.touched.newPasswordConfirm}
                        />

                        <Button onClick={handleSubmit} text='Изменить пароль' disabled={!formik.isValid} />

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
            props: {}
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

