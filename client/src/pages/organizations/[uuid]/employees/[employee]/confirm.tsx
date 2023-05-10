import Layout from '@/components/layouts/Layout'
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import Card from '@/components/layouts/Card';
import Button from '@/components/Button';
import MultiStepControls from '@/components/MultiStepControls';
import Input from '@/components/Input';
import { useFormik } from 'formik';
import * as Yup from 'yup'
import axiosInstance from '@/utils/axios';
import UserCard from '@/components/UserCard';


type Props = {
    employee: {
        uuid: string,
        position: string,
        user: {
            name: string,
            surname: string,
            pfp: string
        }
    }
}

const initialValues = {
    position: 'Получатель чаевых'
}

const editProfileSchema = Yup.object().shape({
    position: Yup.string().required('Обязательное поле').min(3, 'Минимально 3 символа').max(32, 'Максимально 32 символа'),
})


export default function Organization({ employee }: Props) {

    const router = useRouter()
    const formik = useFormik(
        {
            initialValues,
            onSubmit: values => {
                axiosInstance.patch(`/api/organizations/employees/${employee.uuid}/confirm`, {
                    position: values.position
                })
                router.back()
            },
            validationSchema: editProfileSchema
        })

    return (
        <>
            <Layout title={'Добавление сотрудника'}>
                <UserCard fullname={`${employee.user.name} ${employee.user.surname}`} pfp={employee.user.pfp} className='mb-8' />
                <Card>
                    <MultiStepControls handleBack={() => { router.back() }} handleExit={() => router.back()} showBack showExit />
                    {/* {error && <p className="text-error">{error}</p>} */}

                    <div className="flex flex-col gap-y-8">

                        <Input label="Укажите должность сотрудника" placeholder="Должность сотрудника" type="text" required
                            onFocus={e => formik.setFieldTouched('position')}
                            onChange={e =>
                                formik.setFieldValue('position', e.target.value)}
                            error={formik.errors?.position}
                            value={formik.values.position}
                            touched={formik.touched.position}
                        />

                        <Button onClick={() => formik.handleSubmit()} text='Пригласить сотрудника' disabled={!formik.isValid} />

                    </div>

                </Card>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    console.log(ctx.query)
    try {
        const res = await axiosInstance.get(`/organizations/employees/${ctx.query.employee}`, {
            headers: ctx.req.headers
        })
        return {
            props: {
                employee: res.data
            }
        }
    } catch (e) {
        console.error(e)
        return {
            props: {},
            // redirect: {
            //     permanent: false,
            //     destination: "/signin"
            // }
        }
    }
}

