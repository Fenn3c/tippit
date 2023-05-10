import Layout from '@/components/layouts/Layout'
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import Card from '@/components/layouts/Card';
import ProfileIcon from '@/components/ProfileIcon';
import ExitIcon from '@/components/ExitIcon';
import AddTipLinkButton from '@/components/AddTipLinkButton';
import axiosInstance from '@/utils/axios';
import Button from '@/components/Button';
import QrCard from '@/components/QrCard';
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN



type Props = {
    organization: { uuid: string, name: string }
}

export default function Organization({ organization }: Props) {

    const router = useRouter()

    const handleDelete = async () => {
        await axiosInstance.delete(`/api/organizations/${organization.uuid}`)
        router.push('/organizations');
    }

    return (
        <>
            <Layout title={organization.name}>
                <div className="flex flex-col gap-y-8">

                    <QrCard
                        name='Получить чаевые как организация'
                        topLabel='Сотрудник должен быть зарегистрирован'
                        link={`${DOMAIN_NAME}/o/${organization.uuid}`}
                        bottomLabel='Сканируйте код при помощи камеры или воспользуйтесь ссылкой.'
                    />
                    <QrCard
                        name='Пригласите сотрудника'
                        topLabel='Сотрудник должен быть зарегистрирован'
                        link={`${DOMAIN_NAME}/organizations/${organization.uuid}/invite`}
                        bottomLabel='Сканируйте код при помощи камеры или воспользуйтесь ссылкой.'
                    />

                    <Link href={`/organizations/edit/${organization.uuid}`}>
                        <Button text="Редактировать информацию" />
                    </Link>

                    <Button text="Удалить организацию" onClick={handleDelete} red />
                </div>


            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get(`/organizations/${ctx.query.uuid}`, {
            headers: ctx.req.headers
        })
        return {
            props: {
                organization: res.data
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

