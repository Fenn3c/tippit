import Layout from '@/components/layouts/Layout'
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import axiosInstance from '@/utils/axios';
const DOMAIN_NAME = process.env.NEXT_PUBLIC_DOMAIN



type Props = {
}

export default function Organization({ }: Props) {

    const router = useRouter()


    return (
        <>
            <Layout title={'Приглашение в организацию'}>
                <div className="flex flex-col gap-y-8">
                    Добро пожаловать
                </div>
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get(`/organizations/${ctx.query.uuid}/invite`, {
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

