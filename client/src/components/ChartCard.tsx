import { useEffect, useRef, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { CategoryScale, ChartArea, ChartData } from 'chart.js';
import Chart from 'chart.js/auto';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import PercentChange from './PercentChange';
import { formatMoney } from '@/utils/formatMoney';
import Card from './layouts/Card';
Chart.register(CategoryScale);

type Props = {
    title: string,
    data: { x: string[], y: number[], price: number, percent: number }
    color?: string
    animationDuration?: number
    animationDelay?: number
}


export default function ChartCard({ title, data, color = '#3D96FF', animationDuration = 1, animationDelay = 0 }: Props) {
    const price = useAnimatedCounter(data.price, 0, animationDuration, animationDelay)
    const percent = useAnimatedCounter(Math.abs(data.percent), 0, animationDuration, animationDelay)
    const chartRef = useRef<any>(null)
    const [chartData, setChartData] = useState<ChartData<'line'>>({
        datasets: [],
    });

    useEffect(() => {
        const gradient = (ctx: CanvasRenderingContext2D, area: ChartArea) => {
            const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
            gradient.addColorStop(0, `${color}00`)
            gradient.addColorStop(1, color)
            return gradient
        }

        const chart = chartRef.current
        if (!chart) {
            return;
        }

        const chartData: ChartData<'line'> = {
            labels: data.x,
            datasets: [{
                data: data.y,
                borderWidth: 3,
                borderJoinStyle: 'round',
                fill: true,
                borderColor: color,
                backgroundColor: gradient(chart.ctx, chart.chartArea),

            }]
        }
        setTimeout(() => setChartData(chartData), animationDelay * 1000)


    }, [color, data.x, data.y, animationDelay])
    return (
        <Card square>
            <div className='flex justify-between'>
                <p className='font-bold'>{title}</p>
                <PercentChange percent={percent} />
            </div>

            <p className='text-2xl font-bold mb-2'>
                {formatMoney(price)}
            </p>

            <div className='h-full w-full'>
                <Line className='w-full h-full' ref={chartRef}
                    data={
                        chartData
                    }
                    options={{
                        animation: {
                            duration: animationDuration * 1000,
                        },
                        elements: {
                            point: {
                                radius: 0
                            },
                        },
                        scales: {
                            x: {
                                display: true,
                                grid: {
                                    display: false,
                                    drawTicks: false
                                },
                                ticks: {
                                    display: false
                                },
                                border: {
                                    display: false
                                }
                            },
                            y: {
                                grid: {
                                    color: (context) => {
                                        if (context.index === 0) return
                                        else return '#F0F0F0'
                                    },
                                    display: true,
                                    drawTicks: false,
                                },

                                border: {
                                    display: false,
                                    dash: [8, 10]
                                },
                                ticks: {
                                    display: false
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                enabled: false
                            },
                        }

                    }}
                />
            </div>
        </Card>

    )
}