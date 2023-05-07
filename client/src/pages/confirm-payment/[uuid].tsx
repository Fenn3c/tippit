import Button from "@/components/Button";
import CompleteIcon from "@/components/CompleteIcon";
import Card from "@/components/layouts/Card";
import Layout from "@/components/layouts/Layout";
import Link from "next/link";
import axiosInstance from "../../utils/axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

type Props = {
    thankText: string,
}



export default function ConfirmPayment({ thankText }: Props) {

    return (
        <Layout cleanHeader>
            <Card bigYpadding className="mb-4">
                <div className="flex flex-col gap-y-8 items-center text-center ">
                    <CompleteIcon />
                    <div>
                        <p className="font-bold text-2xl mb-2">{thankText}</p>
                        <p className="text-center text-gray-text">Ваши чаевые доставлены</p>
                    </div>
                </div>
            </Card>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get(`/payments/confirm/${ctx.query.uuid}`, {
            headers: ctx.req.headers
        })
        return {
            props: {
                thankText: res.data.tip_link.thank_text
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
