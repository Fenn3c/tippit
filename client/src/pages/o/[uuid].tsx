import Layout from "@/components/layouts/Layout";
import UserCard from "@/components/UserCard";
import axiosInstance from "@/utils/axios";
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from "next/link";


type Props = {
    organization: {
        uuid: string,
        name: string,
        employees: {
            uuid: string,
            position: string | null,
            tipLink: {
                uuid: string
            }
            user: {
                name: string,
                surname: string,
                pfp: string | null
            }
        }[]
    }
}

export default function companyLink({ organization }: Props) {
    const activeEmployees = organization.employees.filter(employee => employee.position)
    return (
        <Layout title={organization.name}>
            <div className="flex flex-col gap-y-4">
                {activeEmployees.map((employee, index) =>
                    <Link href={`/t/${employee.tipLink.uuid}`}>
                        <UserCard key={index} fullname={`${employee.user.name} ${employee.user.surname}`} pfp={employee.user.pfp} position={`${employee.position}`} />
                    </Link>
                )}
            </div>

        </Layout>)
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get(`/organizations/${ctx.query.uuid}`, {
            headers: ctx.req.headers
        })
        console.log(JSON.stringify(res.data))
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

