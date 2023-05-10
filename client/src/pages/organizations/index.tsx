import Layout from '@/components/layouts/Layout'
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import Card from '@/components/layouts/Card';
import AddTipLinkButton from '@/components/AddTipLinkButton';



type Props = {
    organizations: { uuid: string, name: string }[]
}

export default function Organizations({ organizations }: Props) {

    const router = useRouter()

    return (
        <>
            <Layout title="Мои организации">
                <div className="mb-4 flex flex-col gap-y-4">
                    {organizations.map(organization =>
                        <Link href={`/organizations/${organization.uuid}`}>
                            <Card bigYpadding>
                                {organization.name}
                            </Card>
                        </Link>
                    )}
                </div>

                <Link href='/organizations/create'>
                    <AddTipLinkButton />
                </Link>

            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get('/organizations', {
            headers: ctx.req.headers
        })
        return {
            props: {
                organizations: res.data
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

