import Layout from '@/components/layouts/Layout'
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import axiosInstance from '../utils/axios';
import Button from '@/components/Button';
import FinanceOperation from '@/components/FinanceOperation';
import { capitalize } from '@/utils/capitalize';
import { formatMoney } from '@/utils/formatMoney';

const operationsByMonth = (operations: Operation[]) => {
    const reducedOperations = operations.reduce((acc: any, operation) => {
        const date = new Date(operation.date)
        const month = capitalize(`${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`);
        if (!acc[month]) {
            acc[month] = [];
        }
        acc[month].push(operation);
        return acc
    }, {})
    return Object.entries(reducedOperations).map(([month, operations]) => {
        return {
            month,
            operations
        }
    })
}

type Operation = {
    type: 'tip' | 'payout',
    date: string,
    amount: number,
    comment?: string,
}
type Props = {
    balance: number,
    operations: { month: string, operations: Operation[] }[]
}


export default function Finance({ balance, operations }: Props) {
    const router = useRouter()

    return (
        <>
            <Layout title="Баланс" smallTitleMargin>
                <p className="font-bold text-3xl mb-8">{formatMoney(balance)}</p>
                <Button text="Вывести на карту" className="mb-8" />
                <h2 className='text-2xl font-bold mb-6'>История операций</h2>
                {operations.map(({ month, operations }, index) =>
                    <div className="mb-6" key={index}>
                        <p className="font-bold text-base text-gray-text mb-3">{month}</p>
                        <div className='flex flex-col gap-y-4'>
                            {operations.map((operation, index) =>
                                <FinanceOperation key={index} name='Чаевые' amount={operation.amount} comment={operation.comment} />
                            )}
                        </div>
                    </div>
                )}
            </Layout>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get('/payments/operations', {
            headers: ctx.req.headers
        })
        return {
            props: {
                balance: res.data.balance,
                operations: operationsByMonth(res.data.operations)
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

