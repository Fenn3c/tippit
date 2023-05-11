import Layout from '@/components/layouts/Layout'
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import axiosInstance from '../utils/axios';
import Button from '@/components/Button';
import FinanceOperation from '@/components/FinanceOperation';
import { capitalize } from '@/utils/capitalize';
import { formatMoney } from '@/utils/formatMoney';
import ChartCard from '@/components/ChartCard';
import Card from '@/components/layouts/Card';
import StatisticsBigNumberCard from '@/components/StatisticsBigMoneyCard';
import DropMenu from '@/components/DropMenu';



type Props = {
    period: string
    total: number,
    avg: number,
    min: number,
    max: number,
    payments: {
        percent: number,
        dates: string[],
        values: number[],
    }
}


export default function Statistics({ period, total, avg, min, max, payments }: Props) {
    const router = useRouter()
    return (

        <Layout title="Статистика" smallTitleMargin>
            <DropMenu
                initialId={period}
                options={{
                    total: {
                        name: 'За всё время',
                        onSelect() {
                            router.push({
                                query: { period: 'total' }
                            })
                        },
                    },
                    week: {
                        name: 'За неделю',
                        onSelect() {
                            router.push({
                                query: { period: 'week' }
                            })
                        },
                    },
                    month: {
                        name: 'За месяц',
                        onSelect() {
                            router.push({
                                query: { period: 'month' }
                            })
                        },
                    },
                    year: {
                        name: 'За год',
                        onSelect() {
                            router.push({
                                query: { period: 'year' }
                            })
                        },
                    }
                }
                } />
            <div className="grid grid-cols-2 gap-4">
                <ChartCard
                    title='Заработано'
                    color='#3D96FF'
                    data={{
                        price: total,
                        percent: payments.percent,
                        x: payments.dates,
                        y: payments.values, // Все чаевые за неделю например
                    }
                    } />
                <StatisticsBigNumberCard title='В среднем' money={avg} />
                <StatisticsBigNumberCard title='Максимальное' money={max} />
                <StatisticsBigNumberCard title='Минимальное' money={min} />

            </div>
        </Layout>

    )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    try {
        const res = await axiosInstance.get(`/finance/statistics/${ctx.query.period ? ctx.query.period : 'total'}`, {
            headers: ctx.req.headers
        })
        return {
            props: {
                period: res.data.period,
                total: res.data.total,
                avg: res.data.avg,
                min: res.data.min,
                max: res.data.max,
                payments: res.data.payments
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

